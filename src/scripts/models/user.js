import immutable from 'immutable';

const UserType = {
	User:  'user',
	Guest: 'guest'
}

const User = immutable.Record({
	id:       '',
	type:     UserType.Guest,
	access:   '',
	username: ''
});

User.Type = UserType;

export default User;
