/**
 * @class Arrow.Model
 *
 * The Arrow Model API provides an interface to programmatically access
 * Models from an Arrow application.  Models provide an interface to access
 * data (or Model Instances) from an [Arrow Connector](http://docs.appcelerator.com/platform/latest/#!/guide/Arrow.Connector).
 *
 * The Model API is divided into two APIs:
 *
 *   * Use the Arrow Model API to manage the Model class (or the interface to the Models)
 *   * Use the [Arrow Instance API](Arrow.Instance) to manage the Model records (or the data in
 *   model)
 *
 * To create a new Model programmatically, load the `arrow` module, then call:
 *
 *   * {@link Arrow#static-method-createModel Arrow.createModel()} to create a new Model. This is a static or instance method.
 *   * {@link Arrow.Model#define Model.define()} to create a new Model. This is a static method called on the class.
 *   * {@link Arrow.Model#extend Model.extend()} to create a new Model by extending the current instance.
 *   * {@link Arrow.Model#reduce Model.reduce()} to create a new Model by reducing the current instance.
 *
 * After you create the Model class, add it to the current server instance using the
 * {@link Arrow#addModel addModel()} method.
 *
 * To automatically generate the standardized APIs, add the model to the Arrow instance before invoking
 * the Arrow instance's `start()` method.
 *
 * For example:
 *
 *     var Arrow = require('arrow'),
 *         Model = Arrow.Model,
 *         UserModels = Model.getModel('user');
 *     ...
 *     var PersonModels = Model.reduce('person', {
 * 	       fields: {
 * 	           first_name: {type:String, description:'Given name', required:true},
 *             last_name: {type:String, description:'Family name', required:true}
 *         }
 *     });
 *
 *     server.addModel(PersonModels);
 *
 * Alternatively, you can create a model definition file that is automatically loaded by the
 * Arrow project.  For details, see the
 * [Arrow Models guide](http://docs.appcelerator.com/platform/latest/#!/guide/Arrow_Models).
 */

/**
 * @event register
 * @static
 * Fired when a model is registered.  The callback will be passed the Model class.
 */

/**
 * @property actions
 * @type Array<String>
 * An array of data operations supported by the model. The valid values are: `create`, `read`,
 * `update` and `delete`.
 */
/**
 * @property autogen
 * @type Boolean
 * Set to `true` if API endpoints for the Model are auto-generated.
 */
/**
 * @property connector
 * @type Arrow.Connector
 * Connector associated with the model.
 */
/**
 * @property field
 * @type ArrowModelFields
 * Object describing the schema of the model.
 */
/**
 * @property generated
 * @type Boolean
 * Set to `true` if the model is auto-generated by the connector.
 */
/**
 * @property mappings
 * @type Object
 * Object containing mapping functions.  Set the key to the name of the field and the value is
 * another object containing a `get` and `set` function.  Each function is passed the field value,
 * field name and model instance, and must return a value.
 *
 *     {
 * 	     'custom_field': {
 * 	          get: function(value, field, instance) {
 *                if (value == 'California') {
 * 	                  return 'CA';
 *                } else {
 * 	                  return value;
 *                }
 *            }
 *        }
 *     }
 *
 * Functions set in this object are used instead of the ones defined in the model definition object.
 */
/**
 * @property metadata
 * @type ArrowModelMetadata
 * Model metadata.
 */
/**
 * @property name
 * @type String
 * Name of the model.
 */
/**
 * @property plural
 * @type String
 * Plural name for the model.
 */
/**
 * @property singular
 * @type String
 * Singular name for the model.
 */


/**
 * @class ArrowQueryOptions
 * Standard query options used by Arrow for query requests.
 * @pseudo
 */
/**
 * @property [limit=10]
 * @type Number
 * The number of records to fetch. Range: (0, 1000].
 */
/**
 * @property skip
 * @type Number
 * The number of records to skip. Value is greater than zero.
 */
/**
 * @property where
 * @type Object
 * JSON-encoded object specifying field constraints. The field name is the key and the value is the
 * constraint statement or value.
 */
/**
 * @property order
 * @type Object
 * A dictionary of key-value pairs describing the field(s) for sorting.  The field name is the key
 * and the value is set to either `-1` for ascending order or `1` for descending order.
 */
/**
 * @property sel
 * @type Object
 * A dictionary of key-value pairs describing which fields to include in the query results. The
 * field name is the key and the value is set to `1`.
 */
/**
 * @property unsel
 * @type Object
 * A dictionary of key-value pairs describing which fields to exclude from the query results. The
 * field name is the key and the value is set to `1`.
 */
/**
 * @property [page=1]
 * @type Number
 * Starting page number.
 */
/**
 * @property [per_page=10]
 * @type Number
 * Results per page.
 */

/**
 * @class ArrowModelDefinition
 * Object describing the model to create.  You must define the `fields` key.
 * The `connector` key must also be set if you are using the static methods, that is,
 * you are not creating a model from an instance. All other keys are optional.
 *
 * This object can be passed to the following methods:
 *
 *   * {@link Arrow#static-method-createModel}
 *   * {@link Arrow.Model#static-method-define}
 *   * {@link Arrow.Model#extend}
 *   * {@link Arrow.Model#reduce}
 * @pseudo
 */
/**
 * @property fields
 * @type ArrowModelFields
 * An object that represents the model’s schema defined as key-value pairs. The key is the name of
 * the field and the value is the fields object.
 */
/**
 * @property [connector]
 * @type String
 * Name of the connector to which the model is bound. Each model can only have one connector.
 * Connectors are responsible for reading and writing data from/to their data source.
 */
/**
 * @property [metadata]
 * @type ArrowModelMetadata
 * Used to provide a connector specific configuration (e.g., mapping the model to a specific
 * database table for the MySQL connector or defining the join properties).
 */
/**
 * @property [autogen=true]
 * @type String
 * Used to determine whether to generate API endpoints directly from the model. If the endpoint is
 * auto-generated, you do not need to create an API endpoint definition.
 */
/**
 * @property [actions]
 * @type Array<String>
 * An array of data operations supported by the model. The valid values are: `create`, `read`,
 * `update` and `delete`. By default, all are supported by the model.
 */
/**
 * @property [plural]
 * @type String
 * A string used as the property name when your API endpoint returns an array. By default, the
 * plural value is the plural of the model name. For example, if your model is named car, the default
 * plural would be cars. Note: this value can be set on an API or a model.
 */
/**
 * @property [singular]
 * @type String
 * A string used as the property name when your API endpoint returns an array. By default, the
 * singular value is the name of the model. Note: this value can be set on an API or a model.
 */
/**
 * @property [before]
 * @type String/Array<String>
 * One or more blocks to be executed before the request. Blocks are referenced by their name property.
 * If you want to execute multiple blocks, you should specify them as an array of block names.
 * If multiple blocks are specified, they are executed in the order specified.
 */
/**
 * @property [after]
 * @type String/Array<String>
 * One or more blocks to be executed after the request. Blocks are referenced by their name property.
 * If you want to execute multiple blocks, you should specify them as an array of block names.
 * If multiple blocks are specified, they are executed in the order specified.
 */

/**
 * @class ArrowModelFields
 * Object representing one field in the model's schema.  You must define the `type` key.
 * All other keys are optional.
 * @pseudo
 */
/**
 * @property type
 * @type String
 * The field type (e.g., `string`). Type can be any valid JavaScript primitive type.
 * Type can be specified as a string (e.g., `string`) or by the type class (e.g., String).
 */
/**
 * @property [required=false]
 * @type Boolean
 * Specifies whether the field is required or not. Set to `true` if the field is required.
 */
/**
 * @property [validator]
 * @type Function/RegExp
 * A function or regular expression that validates the value of the field. The function is
 * passed the data to validate and should return either null or undefined if the validation
 * succeeds. Any other return value means the validation failed, and the return value will
 * be used in the exception message. If a regular expression is used, it should evaluate to
 * either true or false.
 */
/**
 * @property [name]
 * @type String
 * Used if the model field name is different than the field name in the connector’s model
 * or the underlying data source for the field name. For example, if my model field is
 * `first_name` and the column in a MySQL database is `fname`, the value of the name property
 * should be `fname`.
 */
/**
 * @property [default]
 * @type Any
 * The default value for the field.
 */
/**
 * @property [description]
 * @type Any
 * Description of the field, which is used in the generation of the API documentation.
 */
/**
 * @property [readonly=false]
 * @type Boolean
 * If `true` the field will be read-only and any attempt to write the field value will fail.
 */
/**
 * @property [maxlength]
 * @type Number
 * The max length of the field.
 */
/**
 * @property [get]
 * @type Function
 * A function used to set the value of a property that will be sent to the client.
 * This property is useful if you want to define a custom field where the value is derived.
 * The function is passed the value of the property, name of the property and the model instance.
 * Return the value you want to return to the client.
 */
/**
 * @property [set]
 * @type Function
 * A function used to set the value of a property that will be sent to the connector.
 * The function is passed the value of the property, name of the property and the model instance.
 * Return the value you want to return to the connector.
 */
/**
 * @property [custom]
 * @type Boolean
 * This property should be set to `true` if you are defining a custom field. A custom field is one
 * that does not exist in the underlying data source for the connector you specified.
 */
/**
 * @property [model]
 * @type String
 * Model name of the field property. This is either the logical name of a custom model or a
 * connector model  name in the form connector/model_name (e.g., appc.mysql/employee)
 */

/**
 * @class ArrowModelMetadata
 * A dictionary describing the join operation for composite models.
 * @pseudo
 */
/**
 * @property left_join
 * @type ArrowJoinObject
 * Performs a left join, where all models in the primary model are returned regardless if a match
 * was found in the secondary models.
 */
/**
 * @property inner_join
 * @type ArrowJoinObject
 * Performs an inner join, where only records that have matches are returned.
 */

/**
 * @class ArrowJoinObject
 * Object describing the join operation.
 * @pseudo
 */
/**
 * @property model
 * @type String
 * Name of the secondary model to join with this model.
 */
/**
 * @property join_properties
 * @type Object
 * Collection of key-value pairs that determine the keys in each model to perform the join operation.
 * The key is the property of the model defined in this object and the value is the property to
 * join in another model (or the main model for left joins).
 */
/**
 * @property [multiple=false]
 * @type Boolean
 * Determines if the match is one-to-one (`false`) or one-to-many (`true`).
 */
