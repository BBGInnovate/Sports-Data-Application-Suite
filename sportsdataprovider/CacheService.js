/**
 * @fileOverview 	I provide basic caching functionality.
 * @author 			John Allen <jallen@bbg.gov>
 * @version 		1.0.0
 * @module 			CacheService.js
 */

/* *************************** Required Classes **************************** */
/* *************************** Constructor Code **************************** */
var localCache = {};
var hits = 0;
var misses = 0;


/* *************************** Public Methods ****************************** */
/**
 * I return a value from the cache
 * @param {String} scope - I am the scope where the key/value is stored.
 * @param {String} key - I am the key of the value to return.
 */
function get ( scope, key ){

	// is the requested scope an array? If so return it.
	if( isArray( localCache[ scope ] ) ) {

		hits++;

		return localCache[ scope ];
	}

	// is the requested scope an object? check the property is there and return it,
	// else return false.
	if( isObject( localCache[ scope ] ) ) {

		if ( localCache[ scope ][ key ] !== undefined ){

			hits++;
			return localCache[ scope ][ key ];

		} else {

			misses++;
			return null;
		}
	}

	// did they request a value from the top level object?
	if ( localCache[key] !== undefined ){

		hits++;
		return localCache[key];

	} else {

		// were here in the method, so nothing has worked. Not an array, not
		// an object, not in the top level cache object so record the miss
		// and return false
		misses++;
		return null;

	}

	// if we get HERE something is super wrong with the above code!
	throw new Error('Something is VERY wrong with the get code in the CacheService!');
}
exports.get = get;


/**
 * I return the number of hits from the cache I have returned.
 * @returns {Number}
 */
function getHits(){

	return hits;
}
exports.getHits = getHits;


/**
 * I return my internal local cache.
 * @returns {Object}
 */
function getInternalCache(){
	return localCache;
}
exports.getInternalCache = getInternalCache;

/**
 * I return the number of misses requested on the cache.
 * @returns {Number}
 */
function getMisses(){

	return misses;
}
exports.getMisses = getMisses;


/**
 * I return the rough memory footprint of a cached object.
 * @param {String} scope - I am the scope to look up.
 * @param {String} key - I am the key to find
 * @returns {Numeric}
 */
function getSize( scope, key ){

	key = key || '';


	if (localCache[scope] !== undefined){

		// it's an array
		if (isArray( localCache[ scope ] )){
			return roughSizeOfObject( local[ scope ] );
		}

		// its and object and they want the size of a property
		if ( isObject(localCache[ scope ]) &&  localCache[ scope ][ key ] !== undefined){
			return roughSizeOfObject( localCache[ scope ][ key ] );
		}

		// they want the size of an on object
		if ( isObject(localCache[ scope ]) ){
			return roughSizeOfObject( localCache[ scope ] );
		}

	} else { // return the entire size of the localCache

		return roughSizeOfObject( localCache );
	}

}
exports.getSize = getSize;


/**
 * I put a value into a specified cache by key or if no key is passed I push
 * the value onto specified caches array.
 * @param {String} scope - I am the name of the cache scope to put values into. I am Optional.
 * @param {String} key - I am the key name to associate the value with. I am required.
 * @param {Any} value - I am the value to cache. I am required.
 */
function put ( scope, key, value ){

	checkKey( key );

	console.log(arguments);

	if ( value.length === undefined ){
		throw new Error('The value to cache was not passed in. It is required.');
	}

	// no scope was passed in so dump the value into the top level localCache object.
	if ( scope.length === 0 ){

		localCache[key] = value;

		return true;
	}

	// is it an array were putting things into?
	if( isArray( localCache[scope] ) ) {

		localCache[scope].push( value );

		return true;
	}

	// is it an array were putting things into?
	if( isObject( localCache[scope] ) ) {

		localCache[scope][key] = value ;

		return true;
	}

	// if we get here something went wrong... return false
	return false;
}
exports.put = put;


/* *************************** Private Methods ***************************** */
/**
 * I validate a key.
 * @param {string} key - I am the key to check.
 */
function checkKey(key){

	if ( key.length === 0 ){
		throw new Error('The name of the Key was not passed in. It is required.');
	} else {
		return true;
	}
}


/**
 * I check if a value is an Array. e.g.: [1,2,3].
 * @param {Any} value - I am the value to check.
 * @returns {boolean}
 */
function isArray( value ) {

	if (Object.prototype.toString.call( value ) === '[object Array]'){
		return true;
	} else {
		return false;
	}
}


/**
 * I check if a value is an Object e.g.: {prop : 'foo'}
 * @param {Any} value - I am the value to check.
 * @returns {boolean}
 */
function isObject( value ) {

	if (Object.prototype.toString.call( value ) === '[object Object]'){
		return true;
	} else {
		return false;
	}
}


/**
 * I return the rough size of an object.
 * Code from: http://stackoverflow.com/questions/1248302/javascript-object-size
 * @param object
 */
function roughSizeOfObject( object ) {

	var objectList = [];

	var recurse = function( value )
	{
		var bytes = 0;

		if ( typeof value === 'boolean' ) {
			bytes = 4;
		}
		else if ( typeof value === 'string' ) {
			bytes = value.length * 2;
		}
		else if ( typeof value === 'number' ) {
			bytes = 8;
		}
		else if
		(
			typeof value === 'object'
			&& objectList.indexOf( value ) === -1
		)
		{
			objectList[ objectList.length ] = value;

			for( i in value ) {
				bytes+= 8; // an assumed existence overhead
				bytes+= recurse( value[i] );
			}
		}

		return bytes;
	};

	return recurse( object );
}
