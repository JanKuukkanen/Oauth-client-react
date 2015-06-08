import page  from 'page';
import React from 'react';

import Action          from '../../actions';
import UserAction      from '../../actions/user';
import BroadcastAction from '../../actions/broadcast';
import Broadcaster from '../../components/broadcaster';
import FormData from '../../views/form/form-map';

/**
 *
 */

export default React.createClass({
	mixins: [ React.addons.LinkedStateMixin ],
	propTypes: {formProfile: React.PropTypes.string.isRequired},

	getInitialState() {
		return FormData.registerForm.fields.reduce((state, field) => {
			state[field.name] = '';
			return state;
		}, {});
	},

	checkPasswords(){
		if(this.props.formProfile==='register' && this.state.passwordagain!== '') {
			return this.state.passwordagain !== this.state.password ?
				<span className="fa fa-times">Passwords entered do not match!</span>
				: <span className="fa fa-check">Passwords entered are a match!</span>;
		}
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
	},

	submitPrimary(currentForm) {
		return (event) => {
			currentForm.submit(this.state);
			return event.preventDefault();
		}
	},

	submitSecondary(currentForm) {
		return (event) => {
			currentForm.secondary.submit(this.state);
			return event.preventDefault();
		}
	},

	renderForm(formType) {
		let secondaryContent = !formType.secondary ? null : (
			<section className="secondary">
				<p>{formType.secondary.description}</p>
				<button className="btn-secondary"
						onClick={this.submitSecondary(formType)}>
					{formType.secondary.action}
				</button>
			</section>
		);
		return (
			<div className="view view-form">
				<Broadcaster />
				<div className="content">
					<form className="form" onSubmit={this.submitPrimary(formType)}>
						<div className="logo">
							<img src="/dist/assets/img/logo.svg" />
							<h1>Contriboard</h1>
						</div>
						{this.renderFields(formType.fields)}
						{this.checkPasswords()}
						<input type="submit" className="btn-primary"
							value={formType.action} />
						<article className="help">{formType.help}</article>
						<section className="secondary-content">
							{secondaryContent}
						</section>
					</form>
				</div>
			</div>
		);
	},
	
	render() {
		console.log(FormData);
		return this.renderForm(FormData[this.props.formProfile]);
	}
});
