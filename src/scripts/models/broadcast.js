import immutable from 'immutable';
import Action    from '../actions';

/**
 *
 */
const BroadcastType = {
	Error:     new String('error'),
	Broadcast: new String('broadcast')
}

/**
 *
 */
BroadcastType.Error.Message = {
	[Action.User.Login]: {
		status: {
			[401]: 'Wrong username and/or password!'
		},
		default: 'Login failed!'
	},
	[Action.User.Register]: {
		status: {
			[400]: 'Bad email and/or password!',
			[409]: 'User already exists.'
		},
		default: 'Register failed!'
	}
}

/**
 *
 */
BroadcastType.Error.Message.From = function(err, action) {
	if(BroadcastType.Error.Message[action]) {
		let message = BroadcastType.Error.Message[action];
		if(err.statusCode && message.status[err.statusCode]) {
			return message.status[err.statusCode];
		}
		return message.default;
	}
	else return err.message;
}

/**
 *
 */
const Broadcast = immutable.Record({
	id: '', content: '', type: BroadcastType.Broadcast
});

Broadcast.Type = BroadcastType;

export default Broadcast;
