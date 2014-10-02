/** 
 * @fileOverview 	I provide generic Uitlitiy functions.
 * @author 			John Allen <jallen@bbg.gov>
 * @version 		1.0.0
 * @module 			ProjectUtility.js
 */

/* *************************** Required Classes **************************** */
var fs = require('fs');
var dom = require('xmldom').DOMParser;


/* *************************** Constructor Code **************************** */

/* *************************** Public Methods ****************************** */

/**
 * I read an XML file and return its data as JSON
 * @param {String} path - I am the path to the XML file.
 * @return {object}
 */
function getJSONFromXMLFile( path ) {

	var binaryData = fs.readFileSync( path );
	var xmlDoc = new dom().parseFromString( binaryData.toString() );
	var result = xmlToJson( xmlDoc );

	return result;
}


/**
 * I delete the contents of a directory
 * @param {String} dirPath - I am the path of the directory to empty
 * @return {void}
 */
function emptyDirectory( dirPath ) {
  try { var files = fs.readdirSync(dirPath); }
  catch(e) { return; }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile())
        fs.unlinkSync(filePath);
      else
        deleteDirectory(filePath);
    }
};


/**
 * I recursivly delete a directory
 * @param {String} dirPath - I am the path of the directory to delete
 * @return {void}
 */
function deleteDirectory( dirPath ) {
  try { var files = fs.readdirSync(dirPath); }
  catch(e) { return; }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile())
        fs.unlinkSync(filePath);
      else
        deleteDirectory(filePath);
    }
  fs.rmdirSync(dirPath);
};


/**
 * I search JSON objects.
 * @param {String} Path - I am the name of the node to search for.
 *						  Examples can be:
 *						  MainDatContainer.NodeToFind
 *						  or even pass in array positions like:
 *						  UberParent.ChildArray[0].NodeToFind
 * @param {Object} data - I am the JSON object to be searched.
 */
function objectSearch(path, obj) {
	var path = path.split(".");
	var item = path.shift();
	if(item.indexOf("]") == item.length-1) {
		// array
		item = item.split("[");
		var arrayName = item.shift();
		//console.log(item)
		var arrayIndex = parseInt(item.shift().replace("]", ""));
		var arr = obj[arrayName || ""];
		if(arr && arr[arrayIndex]) {
			return this.objectSearch(path.join("."), arr[arrayIndex]);
		} else {
			return null;
		}
	} else {
		// object
		if(obj[item]) {
			if(path.length === 0) {
				return obj[item];
			} else {
				return this.objectSearch(path.join("."), obj[item]);
			}
		} else {
			return null;
		}
	}
}


/**
 * I convert xml to JSON.
 * @param {Object} xml - I am the XML to convert.
 * @param {Object} data - I am the JSON object to be searched.
 */
function xmlToJson( xml ) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};


function Left(str, n){
	if (n <= 0)
		return "";
	else if (n > String(str).length)
		return str;
	else
		return String(str).substring(0,n);
}

function Right(str, n){
	if (n <= 0)
		return "";
	else if (n > String(str).length)
		return str;
	else {
		var iLen = String(str).length;
		return String(str).substring(iLen, iLen - n);
	}
}

// add a contains function
String.prototype.contains = function(it) { 
	return this.indexOf(it) != -1; 
};

// add a splice function
String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};


/* ************************ Exported Public Methods ************************ */
exports.objectSearch = objectSearch;
exports.xmlToJson = xmlToJson;
exports.Left = Left;
exports.Right = Right;
exports.deleteDirectory = deleteDirectory;
exports.emptyDirectory = emptyDirectory;
exports.getJSONFromXMLFile = getJSONFromXMLFile;