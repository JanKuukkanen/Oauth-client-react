/**
 *
 */
export default function(...stores) {
	return {
		componentDidMount() {
			if(!this.onChange || typeof(this.onChange) !== 'function') {
				throw new Error('\'onChange\' must exist and be a function.');
			}
			return stores.forEach((store) => {
				store.addChangeListener(this.onChange);
			});
		},
		componentWillUnmount() {
			return stores.forEach((store) => {
				store.removeChangeListener(this.onChange);
			});
		}
	}
}
