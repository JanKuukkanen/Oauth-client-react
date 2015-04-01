import React from 'react/addons';
import Board from '../models/board';

/**
 *
 */
export default React.createClass({
	mixins: [ React.addons.PureRenderMixin ],

	propTypes: {
		background: React.PropTypes.shape({
			value:         React.PropTypes.string.isRequired,
			requestChange: React.PropTypes.func.isRequired,
		}).isRequired,
	},

	onChange(event) {
		this.props.background.requestChange(event.target.value);
	},

	render() {
		let background = Board.Background[this.props.background.value];
		let preview    = background.url !== null
			? <img src={background.url} />
			: <div className="blanko" />;

		return (
			<div className="background-select">
				<div className="value">
					{preview}
				</div>
				<label>Board Background</label>
				<div className="select">
					<select onChange={this.onChange}
							defaultValue={this.props.background.value}>
						{this.renderOptions()}
					</select>
					<span className="caret fa fa-arrow-down"></span>
				</div>
			</div>
		);
	},

	renderOptions: function() {
		return Object.keys(Board.Background).map(function(key) {
			return (
				<option key={key} value={key}>
					{Board.Background[key].description}
				</option>
			);
		});
	}
});
