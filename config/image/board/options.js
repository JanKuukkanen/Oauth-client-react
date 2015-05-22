'use strict';

// Required options for creating board in jade
var jade = {
    customBackground: '',
    background: '',
    tickets: []                   
};

// Defines zooming for webshot image
var zoomFactor = 1;

// Required options for webshot
var webshot = {
    siteType:   'html',
    zoomFactor: zoomFactor,
    shotSize: {
        width:  1920 * zoomFactor,
        height: 1080 * zoomFactor
    }
};

module.exports = {
    jade: jade,
    zoomFactor: zoomFactor,
    webshot: webshot
}
