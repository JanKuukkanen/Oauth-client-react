import React from 'react/addons';

let find   = React.addons.TestUtils.findRenderedDOMComponentWithTag;
let render = React.addons.TestUtils.renderIntoDocument;

let Control = reqmod('components/control');

/**
 * Control components are those little icon based buttons, which can be toggled
 * active.
 */
describe('components/control', () => {
	it('should render correctly', () => {
		// First we render the actual 'control' component into our 'document'.
		let controlComponent = render(
			<Control icon="book" onClick={() => {}} />
		);

		// Next we check that it has the correct class... It should not be
		// toggled 'active' by default.
		controlComponent.getDOMNode().className.should.equal('control');

		// Retrieve the actual 'icon' component from inside the 'control'.
		let iconComponent = find(controlComponent, 'span');

		// Make sure the 'book' icon is reflected in the CSS classes.
		iconComponent.getDOMNode().className.should.endWith('fa-book');
	});

	it('should be able to be toggled active', () => {
		let controlComponent = render(
			<Control icon="book" onClick={() => {}} active={true} />
		);
		controlComponent.getDOMNode().className.should.endWith('active');
	});
});
