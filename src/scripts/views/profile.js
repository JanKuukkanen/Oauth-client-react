import React from 'react';

import UserStore  from '../stores/user';

import Navigation   from '../components/navigation';
import Broadcaster  from '../components/broadcaster';

/**
 *
 */
export default React.createClass({
	render() {
		return (
			<div className="view view-workspace">
				<Broadcaster />
				<Navigation showHelp={false} title="Contriboard" />
				<div className="content">
				</div>
			</div>
		);
	},
});
