/* ****************************************************************************
 * File: 		rb.js
 *
 * Purpose: 	I am the resource budle service.
 *
 * Author: 		John Allen ( jallen@figleaf.com )
 *
 * Company: 	Fig Leaf Software
 *************************************************************************** */

/* *************************** Required Classes **************************** */
var fs = require('fs');

/* *************************** Constructor Code **************************** */
// read the JSON files into this object...
// resource bundle
var rbBinaryData = fs.readFileSync( process.cwd() + '/app/helpers/rb.json' );
var rbData = JSON.parse( rbBinaryData.toString() );

// countries resouece bundle
var countriesBinaryData = fs.readFileSync( process.cwd() + '/app/helpers/countries.json' );
var countryData = JSON.parse( countriesBinaryData.toString() );

// single object to contain the countries and terms... origional sin
// was that divisions were asked to fill out two spread sheets.
var combinedTerms = {}

for (var rbLanguage in rbData) {
  
	for (var countryLanguage in countryData ){
		
		if (rbLanguage === countryLanguage ){
			
			var rbDataToAppend = rbData[rbLanguage];
			var countryDataToAppend = countryData[countryLanguage]
			var combinedLanguage = {};

			// add all the rb terms to the new object
			for (var rbTerm in rbDataToAppend){
				combinedLanguage[rbTerm] = rbDataToAppend[rbTerm];
			}

			// add all the country data to the new object
			for (var countryTerm in countryDataToAppend){
				combinedLanguage[countryTerm] = countryDataToAppend[countryTerm];
			}

			// add the new combined object to the main language object we return
			combinedTerms[rbLanguage] = combinedLanguage;
		}
	}
}


/* *************************** Public Methods ****************************** */
/**
 * I return a an object with methods to interact with and return language 
 * resources.
 *
 * @param {string} language - I am language. I default to 'english'.
 * @return {void}
 */
function getRB( language ){

	language = language || 'english';

	if ( language === 'undefined' ){
		language = 'english';
	}

	var object = {
		get : function ( item ){

			item = item.replace( " ","" );
			item = item.replace( "ô","o" );
			item = item.replace( "'","" );
			item = item.replace( "’","" );

			return combinedTerms[language][item];
		}
	}

	return object;
};
exports.getRB = getRB;
/* *************************** Private Methods ***************************** */