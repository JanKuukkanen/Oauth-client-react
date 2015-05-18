import EventEmitter from 'events';

/**
 * A minimal wrapper around the basic flux concepts.
 *
 * TODO Should this be published as a standalone module?
 */
export default {
	store:         store,
	actions:       actions,
	actionCreator: actionCreator
}

const Dispatcher = new EventEmitter().setMaxListeners(0);

const CHANGE_EVENT = 'change';
const ACTION_EVENT = 'action';

/**
 * Create a 'flux' store.
 */
function store(blueprint) {
	let emitter = new EventEmitter().setMaxListeners(0);

	let proto = {
		addChangeListener(listener) {
			return emitter.addListener(CHANGE_EVENT, listener);
		},
		removeChangeListener(listener) {
			return emitter.removeListener(CHANGE_EVENT, listener);
		}
	}

	Dispatcher.addListener(ACTION_EVENT, (action) => {
		if(blueprint.handlers[action.type]) {
			blueprint.handlers[action.type](action.payload);
			if(!action.options.silent) {
				return emitter.emit(CHANGE_EVENT);
			}
		}
	});

	return Object.keys(blueprint).filter(k => k !== 'handlers')
		.reduce((proto, property) => {
			proto[property] = blueprint[property];
			return proto;
		}, proto);
}

/**
 * Define a set of actions for your application.
 */
function actions(action, prefix = '') {
	if(action instanceof Object) {
		prefix = prefix.trim() === '' ? '' : `${prefix}_`;

		return Object.keys(action).reduce((object, prop) => {
			let pre   = `${prefix}${prop.toUpperCase()}`;
			let async = action[prop] === true;

			object[prop] = actions(action[prop], pre);

			if(async) {
				object[prop].Success = new String(`${pre}_SUCCESS`);
				object[prop].Failure = new String(`${pre}_FAILURE`);
			}

			return object;
		}, {});
	}
	return new String(prefix);
}

/**
 * Create a 'flux' action creator.
 */
function actionCreator(blueprint) {
	function dispatch(action, payload = {}, options = {}) {
		Dispatcher.emit(ACTION_EVENT, {
			type: action, payload: payload, options: options
		});
	}
	return Object.keys(blueprint).reduce((proto, action) => {
		proto[action] = blueprint[action].bind({ dispatch });
		return proto;
	}, {});
}
