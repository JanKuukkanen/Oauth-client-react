'use strict';

/**
 *
 */
module.exports = function(stores) {
	if(!(stores instanceof Array)) {
		stores = [ stores ];
	}
	return {
		componentDidMount: function() {
			if(!this.onChange || typeof(this.onChange) !== 'function') {
				throw new Error('\'onChange\' must exist and be a function.');
			}

			return stores.forEach(function(store) {
				return store.addChangeListener(this.onChange);
			}.bind(this));
		},
		componentWillUnmount: function() {
			return stores.forEach(function(store) {
				return store.removeChangeListener(this.onChange);
			}.bind(this));
		}
	}
}
