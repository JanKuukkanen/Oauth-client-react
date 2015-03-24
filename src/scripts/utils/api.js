import request from '../utils/request';

export default {
	login:      login,
	loginGuest: loginGuest,
	logout:     logout,
	register:   register,

	getUser:    getUser,
	getBoard:   getBoard,
	getBoards:  getBoards,
	getTicket:  getTicket,
	getTickets: getTickets,

	createBoard:  createBoard,
	createTicket: createTicket,
	updateBoard:  updateBoard,
	updateTicket: updateTicket,
	deleteBoard:  deleteBoard,
	deleteTicket: deleteTicket,

	revokeAccessCode:   revokeAccessCode,
	generateAccessCode: generateAccessCode
}

const API_URL = process.env.API_URL || 'http://localhost:9002/api';

function login(opts = {}) {
	let options = {
		url:     `${API_URL}/auth/login`,
		payload: opts.payload
	}
	return request.post(options).then((res) => {
		return {
			user:  res.body,
			token: res.headers['x-access-token']
		}
	});
}

function logout(opts = {}) {
	let options = {
		url:   `${API_URL}/auth/logout`,
		token: opts.token
	}
	return request.post(options);
}

function register(opts = {}) {
	let options = {
		url:     `${API_URL}/auth/register`,
		payload: opts.payload
	}
	return request.post(options).then((res) => {
		return { user: res.body }
	});
}

function loginGuest(opts = {}) {
	let options = {
		url:     `${API_URL}/boards/${opts.id.board}/access/${opts.id.code}`,
		payload: opts.payload
	}
	return request.post(options).then((res) => {
		return {
			user: {
				id:     res.body.id,
				type:   res.body.type,
				name:   res.body.username,
				access: res.body.access
			},
			token: res.headers['x-access-token']
		}
	});
}

function getUser(opts = {}) {
	let options = {
		url:   `${API_URL}/auth`,
		token: opts.token
	}
	return request.get(options).then((res) => {
		let user = {
			id:   res.body.id,
			type: res.body.type,
			name: res.body.username
		}
		if(user.type === 'guest') {
			user.access = res.body.access;
		}
		return user;
	});
}

function getBoard(opts = {}) {
	let options = {
		url:   `${API_URL}/boards/${opts.id.board}`,
		token: opts.token
	}
	return request.get(options).then((res) => {
		return res.body;
	});
}

function getBoards(opts = {}) {
	let options = {
		url:   `${API_URL}/boards`,
		token: opts.token
	}
	return request.get(options).then((res) => {
		return res.body;
	});
}

function getTicket(opts = {}) {
	let options = {
		url:   `${API_URL}/boards/${opts.id.board}/tickets/${opts.id.ticket}`,
		token: opts.token
	}
	return request.get(options).then((res) => {
		return res.body;
	});
}

function getTickets(opts = {}) {
	let options = {
		url:   `${API_URL}/boards/${opts.id.board}/tickets`,
		token: opts.token
	}
	return request.get(options).then((res) => {
		return res.body;
	});
}

function createBoard(opts = {}) {
	let options = {
		url:     `${API_URL}/boards`,
		token:   opts.token,
		payload: opts.payload
	}
	return request.post(options).then((res) => {
		return res.body;
	});
}

function createTicket(opts = {}) {
	let options = {
		url:     `${API_URL}/boards/${opts.id.board}/tickets`,
		token:   opts.token,
		payload: opts.payload
	}
	return request.post(options).then((res) => {
		return res.body;
	});
}

function updateBoard(opts = {}) {
	let options = {
		url:     `${API_URL}/boards/${opts.id.board}`,
		token:   opts.token,
		payload: opts.payload
	}
	return request.put(options).then((res) => {
		return res.body;
	});
}

function updateTicket(opts = {}) {
	let options = {
		url:     `${API_URL}/boards/${opts.id.board}/tickets/${opts.id.ticket}`,
		token:   opts.token,
		payload: opts.payload
	}
	return request.put(options).then((res) => {
		return res.body;
	});
}

function deleteBoard(opts = {}) {
	let options = {
		url:   `${API_URL}/boards/${opts.id.board}`,
		token: opts.token
	}
	return request.del(options).then((res) => {
		return res.body;
	});
}

function deleteTicket(opts = {}) {
	let options = {
		url:   `${API_URL}/boards/${opts.id.board}/tickets/${opts.id.ticket}`,
		token: opts.token
	}
	return request.del(options).then((res) => {
		return res.body;
	});
}

function generateAccessCode(opts = {}) {
	let options = {
		url:   `${API_URL}/boards/${opts.id.board}/access`,
		token: opts.token
	}
	return request.post(options).then((res) => {
		return res.body;
	});
}

function revokeAccessCode(opts = {}) {
	let options = {
		url:   `${API_URL}/boards/${opts.id.board}/access`,
		token: opts.token
	}
	return request.del(options).then((res) => {
		return res.body;
	});
}
