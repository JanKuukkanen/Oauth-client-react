import flux   from '../utils/flux';
import Action from '../actions';

/**
 *
 */
export default flux.actionCreator({
	setSetting(key, value) {
		this.dispatch(Action.Settings.Edit, { key, value });
	}
});
