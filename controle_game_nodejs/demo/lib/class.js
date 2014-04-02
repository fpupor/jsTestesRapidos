/**
 * Class
 * @author Felipe Pupo Rodrigues
 * @method Class
 * @namespace Sarue
 * @param {Object} propertys
 * @param {Object} abstracts
 * @return {Instance}
 */
function Class(propertys, abstracts){
	function Clone(obj){
		if (obj == null || typeof obj != "object") return obj;
	    if (obj.constructor != Object && obj.constructor != Array) return obj;
	    if (obj.constructor == Date || obj.constructor == RegExp || obj.constructor == Function ||
	        obj.constructor == String || obj.constructor == Number || obj.constructor == Boolean)
	        return new obj.constructor(obj);
	
	    var to = new obj.constructor();
			
	    for (var name in obj)
	    {
	        to[name] = Clone(obj[name], null);
	    }
	
	    return to;
	};
	
	abstracts = Clone(abstracts);
	
	/**
	 * Constructor
	 * @author Felipe Pupo Rodrigues
	 * @method Constructor
	 * @namespace Sarue.Class
	 * @return {Instance}
	 * @classDescription method for constructor a construct class.
	 */
	function Constructor(){
		/**
		 * Instance
		 * @author Felipe Pupo Rodrigues
		 * @method Instance
		 * @namespace Sarue.Class.Constructor
		 * @return {UserDefine}
		 * @classDescription Instance of constructor class
		 */
		
		var insPropertys = Clone(propertys);
			
		function Instance(options){
			//set new options
			
			//set construct default options
			if (Constructor.defaults && options)
				Instance._options(options, true);
			else {
				//set instance default options
				if (Instance.defaults && options) 
					Instance._options(options);
			}
			
			//call constructor method
			return Instance.construct.apply(Instance, arguments); 
		}
		
		Instance.prototype.constructor = Instance.self = Constructor;
		
		//add magic methods;
		for(var key in magicMethods)
			addProperty(key, magicMethods, Instance);
		
		//add class propertys;
		for(key in insPropertys)
			addProperty(key, insPropertys, Instance);
		
		//extend new parent instance
		if (Instance.parent) {
			Instance.parent = new Instance.parent(Class.EXTEND);
			Instance.parent.prototype._this = Instance;
			
			var prototype = Instance.parent.prototype.constructor.prototype.propertys;
			
			//delete propertys
			for(key in prototype){
				if (typeof prototype[key] != 'function' && (!prototype[key] || prototype[key] == Instance[key])) {
					delete Instance.parent[key];
				}
			}
		}
		
		//call constructor
		if(arguments[0] !== Class.EXTEND)
			Instance.apply(Instance, arguments);
		
		return Instance;
	}
	
	/**
	 * addProperty
	 * @author Felipe Pupo Rodrigues
	 * @method addProperty
	 * @namespace Sarue.Class
	 * @param {String} key
	 * @param {Object} from
	 * @param {Constructor, Instance} to
	 * @classDescription Add real Methods and Propertys
	 */
	function addProperty(key, from, to){
		if (typeof(from[key]) == "function" && !!from[key].call && from[key] !== Constructor && from[key] !== Class && (from[key]['prototype'] && from[key]['prototype']['constructor'] && from[key]['prototype']['constructor'] !== Class)) {
			
			var method = from[key];
			
			/**
			 * Method
			 * @return {Method}
			 */
			function Method()
			{
				try {
					//search actual scope
					while (to.prototype._this && to.prototype._this !== to) {
						to = to.prototype._this;
					}
					
					//ignore magic methods
					if (magicMethods[key]) 
						return method.apply(to, arguments);
					
					//intercept methods call
					if (!to['_call'] || to._call.apply(to, [key, arguments]) && to['_endcall'])
						return to._endcall.apply(to, [key, method.apply(to, arguments)]);
					
					return null;
				}catch(e){
					return to['_error'] ? to._error.apply(to, [e, key, arguments, from]) : null; 
				}
			}
			
			to[key] = Method;
			
			return Method;
		}
		
		to[key] = from[key];
	}
	
	/**
	 * Magic Methods, add in all class
	 */
	var magicMethods = {
		construct: function(){},
		
		_call: function(key, args){
			return true;
		},
		_endcall: function(key, result){
			return result;
		},
		_options: function(options, abstracts){
			this.options = this.options || {};
			var defaults = abstracts ? this.self.defaults : this.defaults;
			
			for (var key in defaults) {
				this.options[key] = options[key] || defaults[key];
			}
		},
		_intercept: function(obj){
			for (var key in obj) {
				var parent = this[key];
				var method = addProperty(key, obj, this);
				
				if(method)
					method[key] = parent;
			}
		},
		_error: function(e){
			var util = require('util');
			return util ? util.log(util.inspect(e)) : e;
		}
	}
	
	
	Constructor.prototype.constructor = Class;
	Constructor.prototype.propertys = propertys;
	Constructor.prototype.abstracts = abstracts;
	
	/**
	 * implement
	 * @author Felipe Pupo Rodrigues
	 * @method implement
	 * @namespace Sarue.Class.Constructor
	 * @param {Object} propertys
	 * @return {Constructor}
	 */
	addProperty('implement', {
		implement: function(parent){
			Constructor = Class.implement(parent, Constructor.prototype.propertys, Constructor.prototype.abstracts);
			return Constructor;
		}
	}, Constructor);
	
	for(var key in magicMethods)
		if(key == 'construct' || key == '_call' || key == '_endcall' || key == '_error')
			addProperty(key, magicMethods, Constructor);
	
	for(var key in abstracts)
		addProperty(key, abstracts, Constructor);
	
	return Constructor.construct.apply(Constructor, []) || Constructor;
};

//Unique Constant for check extend;
Class.EXTEND = {};

/**
 * Extend
 * @author Felipe Pupo Rodrigues
 * @method Extend
 * @namespace Sarue.Class
 * @param {Class} class
 * @param {Object} propertys
 * @param {Object} abstract
 * @return {Constructor}
 * @classDescription Extend property and return a new constructor
 */
Class.extend = function(parent, propertys, abstracts){
	propertys = propertys || {};
	abstracts = abstracts || {};
	
	//merge extend propertys
	for(var key in parent.prototype.propertys)
		if(propertys[key] === undefined)
			propertys[key] = parent.prototype.propertys[key];
	
	//merge extend abstracts propertys
	for(var key in parent.prototype.abstracts)
		if(abstracts[key] === undefined)
			abstracts[key] = parent.prototype.abstracts[key];
	
	propertys.parent = parent;
	
	//create new constructor
	return new Class(propertys, abstracts);
}

/**
 * Implement
 * @author Felipe Pupo Rodrigues
 * @method Implement
 * @namespace Sarue.Class
 * @param {Class} class
 * @param {Object} propertys
 * @param {Object} abstract
 * @return {Constructor}
 * @classDescription Implement propertys and return a new constructor
 */
Class.implement = function(parent, propertys, abstracts){
	if(!parent) return null;
	
	if(parent.length && parent.length > 1){
		var implement, klass;
		
		for (var c = 0; c < parent.length; c++) {
			klass = parent[c];
			
			if(klass.prototype.constructor !== Class)
				klass = klass[klass.prototype.constructor];
			
			implement = new Class.implement(klass, propertys, abstracts);
			propertys = implement.prototype.propertys;
			abstracts = implement.prototype.abstracts;
		}
		
		return implement;
	}
	
		
	/**
	 * mergeProperty
	 * @method mergeProperty
	 * @namespace Sarue.Class.implement
	 * @param {String} key
	 * @param {Object} original
	 * @param {Object} implement
	 * @return {Object}
	 * @classDescription Merge methods/replace propertys
	 */
	function mergeProperty(key, original, implement){
		if (typeof implement[key] == 'function') {
			var parent = original[key] || function(){};
			var method = implement[key] || function(){};
			
			implement[key] = function(){
				return  method.apply(this, arguments) || parent.apply(this, arguments);
			}
			
			return;
		}
		
		if (implement[key] === undefined) 
			implement[key] = original[key];
	}
	
	propertys = propertys || {};
	
	//implement new propertys
	for(var key in parent.prototype.propertys)
		mergeProperty(key, parent.prototype.propertys, propertys);
		
	abstracts = abstracts || {};
	
	//implement new abstracts propertys
	for(var key in parent.prototype.abstracts)
		mergeProperty(key, parent.prototype.abstracts, abstracts);
	
	
	//create new constructor
	return new Class(propertys, abstracts);
}
/**
 * exists
 * @author Felipe Pupo Rodrigues
 * @method exists
 * @namespace Sarue.Class
 * @param {String} namespace
 * @param {Object,Namespace} scope
 * @return {Boolean}
 */
Class.exists = function(name, scope){
	name = name.split('.');
	scope = scope || window;
	
	for (var x = 0, ns; ns = name[x]; x++) {
		if (!scope[ns]) 
			return false;
		scope = scope[ns];
	}
	
	return scope;
}


Class.namespace = function(nspace, scope, construct){
	nspace = typeof nspace == 'string' ? nspace.split('.') : nspace;
	scope = scope || window;
	
	for (var x = 0, n; n = nspace[x]; x++) {
		if(!scope[n])
			scope[n] = (construct && (x+1) >= nspace.length) ? new construct() : new Class();
			
		scope = scope[n];
	}
	
	return scope
}

this.Class = Class;