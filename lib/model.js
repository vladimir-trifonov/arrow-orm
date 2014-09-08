var util = require('util'),
	events = require('events'),
	_ = require('lodash'),
	async = require('async'),
	Instance = require('./instance'),
	error = require('./error'),
	ORMError = error.ORMError,
	ValidationError = error.ValidationError,
	Collection = require('./collection');

util.inherits(Model, events.EventEmitter);
module.exports = Model;

function Model(name, definition, skipValidation){
	this.name = name;
	this.fields = definition && definition.fields;
	this.connector = definition && definition.connector;

	if (!skipValidation && !this.connector) {
		throw new ORMError("missing required connector");
	}
	if (!skipValidation && !definition) {
		throw new ORMError("missing required definition");
	}
	if (!skipValidation && this.fields.id) {
		throw new ValidationError('id',"id is a reserved field name for the generated primary key");
	}
}

Model.prototype.createRequest = function(request) {
	var promise = this.connector.createRequest(request);
	var model = new Model(this.name, null, true);
	model.fields = this.fields;
	model.connector = promise;
	model.login = promise.login;
	return model;
};

/**
 * define or extend a new Model instance
 */
Model.extend =
Model.define = function define(name, definition) {
	return new Model(name, definition);
};

/**
 * create a new Model which extends the current model instance
 */
Model.prototype.extend = function extend(name, definition) {
	var model;
	if (typeof name === 'string') {
		model = new Model(name, definition, true);
	}
	else if (name instanceof Model) {
		model = name;
	}
	else {
		throw new ORMError("invalid argument passed to extend. Must either be a model class or model definition");
	}
	return _.merge(this,model);
};

/**
 * create a new Model object.
 *
 * @param {Array|Object} if array, creates all objects and returns collection, else creates one instance
 */
Model.prototype.create = function create(values, callback) {
	if (typeof values === 'function') {
		callback = values;
		values = {};
	}
	// if we have an array of values, create all the users in one shot
	// TODO: we might want to optimize this on the Connector interface
	// in the case of a DB, you want to send them in batch
	if (Array.isArray(values)) {
		var tasks = [],
			self = this;
		values.forEach(function iterator(v){
			tasks.push(function task(next){
				self.connector.create(self,v,next);
			});
		});
		return async.series(tasks,function seriesCallback(err,results){
			if (err) { return callback(err); }
			var collection = new Collection(self,results);
			callback(null, collection);
		});
	}
	try {
		this.connector.create(this, values, callback);
	}
	catch (E) {
		if (E instanceof ORMError) {
			return callback(E);
		}
		throw E;
	}
};

/**
 * return an instance of this Model
 */
Model.prototype.instance = function instance(values) {
	return new Instance(this, values);
};

/**
 * save or update Model instance
 */
Model.prototype.update =
Model.prototype.save = function save(instance, callback) {
	if (instance._deleted) {
		callback && callback(new ORMError('instance has already been deleted'));
		return;
	}
	if (!(instance instanceof Instance) || instance._dirty) {
		this.connector.save(this, instance, function saveCallback(err,result){
			if (err) { return callback && callback(err); }
			if (result) {
				result._dirty = false;
				result.emit('save');
			}
			callback && callback(null,result);
		});
	}
	else {
		callback && callback();
	}
};

/**
 * remove instance
 */
Model.prototype.delete =
Model.prototype.remove = function remove(instance, callback) {
	if (instance instanceof Instance && instance._deleted) {
		return callback && callback(new ORMError('instance has already been deleted'));
	}
	this.connector.delete(this, instance, function deleteCallback(err,result){
		if (err) { return callback && callback(err); }
		if (result) {
			result._deleted = true;
			result.emit('delete');
		}
		callback && callback(null,result);
	});
};

/**
 * delete all the rows
 */
Model.prototype.deleteAll =
Model.prototype.removeAll = function removeAll(callback) {
	this.connector.deleteAll(this, callback);
};


/**
 * find one instance using primary key
 */
Model.prototype.findOne = function findOne(id, callback) {
	this.connector.findOne(this, id, callback);
};

/**
 * find all instances
 */
Model.prototype.findAll = function findAll(callback) {
	this.connector.findAll(this, callback);
};

/**
 * find instances matching properties.  if value is an id, operates as
 * a findOne.  if value is a callback function, operates as a findAll.
 * if value is an object of key/values, which only return instances matching
 * the values of keys
 */
Model.prototype.fetch =
Model.prototype.find = function find(value, callback) {
	if (typeof value === 'function') {
		return this.findAll(value);
	}
	else if (typeof value === 'object') {
		return this.connector.find(this, value, callback);
	}
	return this.findOne(value, callback);
};