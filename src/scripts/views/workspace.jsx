'use strict';

var React = require('react');

var Sidebar = require('../components/sidebar.jsx');

var Workspace = React.createClass({
	render: function() {
		return (
			<div className="application">
				<Sidebar user={this.props.user} />
				<div className="view view-workspace">
					WorkSpace, nyah!
					<a href="/boards/123">Click Me</a>
				</div>
			</div>
		);
	}

});

module.exports = Workspace;
