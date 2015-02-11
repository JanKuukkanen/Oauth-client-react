'use strict';

var page  = require('page');
var React = require('react');

var Logo = React.createClass({
	propTypes: {
		url:   React.PropTypes.string,
		title: React.PropTypes.string,
	},

	getDefaultProps: function() {
		return {
			url:   null,
			title: null,
		}
	},

	_navigate: function() {
		if(this.props.url) {
			return page.show(this.props.url);
		}
	},

	render: function() {
		if(this.props.title) {
			var title = (
				/* jshint ignore:start */
				<div className="logo-title-container">
					<div className="logo-title">
						{this.props.title}
					</div>
				</div>
				/* jshint ignore:end */
			);
		}
		return (
			/* jshint ignore:start */
			<div className="logo-container">
				<div className="logo" onClick={this._navigate}>
					<div className="logo-header-bar"/>
					<div className="logo-content-area" />
				</div>
				{title}
			</div>
			/* jshint ignore:end */
		);
	}

});

module.exports = Logo;
