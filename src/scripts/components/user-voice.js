import React  from 'react';
import Hammer from 'hammerjs';

export default React.createClass({
	propTypes: {
		mode: React.PropTypes.string
	},

	getDefaultProps() {
		return { mode: 'contact' }
	},

	componentWillMount() {
		if(!window.UserVoice) {
			let uv   = document.createElement('script');
			uv.src   = '//widget.uservoice.com/eXKxE4WzstJy0DTpmrepAA.js';
			uv.async = true;
			return document.head.appendChild(uv);
		}
	},

	componentDidMount() {
		new Hammer(this.getDOMNode()).on('tap', () => {
			window.UserVoice.push([ 'show', {
				mode:   this.props.mode,
				target: this.getDOMNode()
			} ]);
		});
	},

	render() {
		return (
			<div className="user-voice-trigger">
				{this.props.children}
			</div>
		);
	}
});
