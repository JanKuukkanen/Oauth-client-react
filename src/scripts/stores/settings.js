import flux   from '../utils/flux';
import Action from '../actions';

/**
 *
 */
export default flux.store({
	getSetting(name) {
		return JSON.parse(localStorage.getItem(name));
	},
	handlers: {
		[Action.Settings.Edit](payload) {
			localStorage.setItem(payload.key, payload.value);
		}
	}
});
