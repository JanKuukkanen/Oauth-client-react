import immutable from 'immutable';

import uid  from '../utils/uid';
import flux from '../utils/flux';

import Action    from '../actions';
import Broadcast from '../models/broadcast';

/**
 *
 */
let broadcasts = immutable.List();

/**
 *
 */
export default flux.store({
	getBroadcasts() {
		return broadcasts;
	},
	handlers: {
		[Action.Broadcast.Add](payload) {
			let broadcast = new Broadcast({
				id:      uid(),
				type:    payload.type,
				content: payload.content
			});
			broadcasts = broadcasts.push(broadcast);
		},
		[Action.Broadcast.Remove](payload) {
			let index = broadcasts.findIndex((broadcast) => {
				return broadcast.id === payload.id;
			});
			if(index >= 0) {
				broadcasts = broadcasts.remove(index);
			}
		}
	}
});
