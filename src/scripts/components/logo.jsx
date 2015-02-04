'use strict';

var page  = require('page');
var React = require('react');

var Logo = React.createClass({
	propTypes: {
		url: React.PropTypes.string,
	},

	getDefaultProps: function() {
		return {
			url: null,
		}
	},

	_navigate: function() {
		if(this.props.url) {
			return page.show(this.props.url);
		}
	},

	render: function() {
		return (
			<div className="logo" onClick={this._navigate}>
				<div className="logo-header-bar"/>
				<div className="logo-content-area" />
			</div>
		);
	}

});

module.exports = Logo;
