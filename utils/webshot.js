'use strict';

var webshot  	 = require('webshot');
var jade 	 	 = require('jade');

var imageOptions = require('../config/image/options');

function imageExistsCheck(html) {

}

function generateImage(type, callback, jadeOptions, webshotOptions) {
	var jadeOpt = jadeOptions;
	var webshotOpt = webshotOptions;
	var optionsDefault = imageOptions.getFromType(type);

	// If options weren't given then use default
	if(typeOf jadeOpt == "undefined") {jadeOpt = optionsDefault.jadeOptions;};
	if(typeOf webshotOpt == "undefined") {webshotOpt = optionsDefault.webshotOptions;};

	// Where image will be created before saving to db
	imagePath = '/temp/' + 'id' + 'png';


	// Generates html
	return jade.renderFile(jadePath, jadeOpt, function(err, html) {
		if(err) {
			return callback(err);
		}

		// Check if image already exists
		if(imageExistsCheck(html)) {
			return callback();
		}

		// Generate image from html
		return webshot(html, imagepath, webshotOpt, function(err) {
			if(err) {
				return callback(err);
			}

			return callback();
		});
	});	
}

module.exports = {
	generateImage: generateImage
}