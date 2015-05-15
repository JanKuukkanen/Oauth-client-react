import React       from 'react/addons';
import Broadcaster from '../../components/broadcaster';

/**
 *
 */
export default React.createClass({
	mixins: [ React.addons.LinkedStateMixin ],

	propTypes: {
		fields: React.PropTypes.arrayOf(React.PropTypes.shape({
			type: React.PropTypes.oneOf([
				'text', 'email', 'password'
			]).isRequired,
			name:     React.PropTypes.string.isRequired,
			label:    React.PropTypes.string.isRequired,
			title:    React.PropTypes.string,
			pattern:  React.PropTypes.string,
			required: React.PropTypes.bool
		})),

		secondary: React.PropTypes.shape({
			submit:      React.PropTypes.func.isRequired,
			action:      React.PropTypes.string.isRequired,
			description: React.PropTypes.string
		}),

		help:   React.PropTypes.string,
		submit: React.PropTypes.func.isRequired,
		action: React.PropTypes.string.isRequired
	},

	getDefaultProps() {
		return { fields: [ ], secondary: null }
	},

	getInitialState() {
		return this.props.fields.reduce((state, field) => {
			state[field.name] = '';
			return state;
		}, {});
	},

	submitPrimary(event) {
		this.props.submit(this.state);
		return event.preventDefault();
	},

	submitSecondary(event) {
		this.props.secondary.submit(this.state);
		return event.preventDefault();
	},

	render() {
		let secondaryContent = !this.props.secondary ? null : (
			<section className="secondary">
				<p>{this.props.secondary.description}</p>
				<button className="btn-secondary"
						onClick={this.submitSecondary}>
					{this.props.secondary.action}
				</button>
			</section>
		);
		return (
			<div className="view view-form">
				<Broadcaster />
				<div className="content">
					<form className="form" onSubmit={this.submitPrimary}>
						<div className="logo">
							<img src="/dist/assets/img/logo.svg" />
							<h1>Contriboard</h1>
						</div>
						{this.renderFields(this.props.fields)}
						<input type="submit" className="btn-primary"
							value={this.props.action} />
						<article className="help">{this.props.help}</article>
						<section className="secondary-content">
							{secondaryContent}
						</section>
					</form>
				</div>
			</div>
		);
	},

	renderFields(fields) {
		return fields.map((field, index) => {
			let controlattrs = {
				title:    field.title,
				pattern:  field.pattern,
				required: field.required
			}
			return (
				<section key={field.name} className="input">
					<label htmlFor={field.name}>{field.label}</label>
					<input autoFocus={index === 0} name={field.name}
						type={field.type} {...controlattrs}
						valueLink={this.linkState(field.name)} />
				</section>
			);
		});
	}
});
