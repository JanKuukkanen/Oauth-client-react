var images = require('./');

function getFromType(type) {
	switch(type) {
    	case 'board':
    		return {
    			options: images.board.options,
    			path: '/config/image/board/site.jade'
    		};
    };
}

module.exports = {
    getFromType: getFromType
}