'use strict';

/**
 * @module constants/actions
 */
module.exports = {
	LOAD_TICKETS:         'LOAD_TICKETS',
	LOAD_TICKETS_SUCCESS: 'LOAD_TICKETS_SUCCESS',
	LOAD_TICKETS_FAILURE: 'LOAD_TICKETS_FAILURE',

	LOAD_BOARD:         'LOAD_BOARD',
	LOAD_BOARD_SUCCESS: 'LOAD_BOARD_SUCCESS',
	LOAD_BOARD_FAILURE: 'LOAD_BOARD_FAILURE',

	LOAD_BOARDS:         'LOAD_BOARDS',
	LOAD_BOARDS_SUCCESS: 'LOAD_BOARDS_SUCCESS',
	LOAD_BOARDS_FAILURE: 'LOAD_BOARDS_FAILURE',

	LOAD_USER:         'LOAD_USER',
	LOAD_USER_SUCCESS: 'LOAD_USER_SUCCESS',
	LOAD_USER_FAILURE: 'LOAD_USER_FAILURE',

	ADD_TICKET:         'ADD_TICKET',
	ADD_TICKET_SUCCESS: 'ADD_TICKET_SUCCESS',
	ADD_TICKET_FAILURE: 'ADD_TICKET_FAILURE',

	ADD_BOARD:         'ADD_BOARD',
	ADD_BOARD_SUCCESS: 'ADD_BOARD_SUCCESS',
	ADD_BOARD_FAILURE: 'ADD_BOARD_FAILURE',

	EDIT_TICKET:         'EDIT_TICKET',
	EDIT_TICKET_SUCCESS: 'EDIT_TICKET_SUCCESS',
	EDIT_TICKET_FAILURE: 'EDIT_TICKET_FAILURE',

	EDIT_BOARD:         'EDIT_BOARD',
	EDIT_BOARD_SUCCESS: 'EDIT_BOARD_SUCCESS',
	EDIT_BOARD_FAILURE: 'EDIT_BOARD_FAILURE',

	REMOVE_TICKET:         'REMOVE_TICKET',
	REMOVE_TICKET_SUCCESS: 'REMOVE_TICKET_SUCCESS',
	REMOVE_TICKET_FAILURE: 'REMOVE_TICKET_FAILURE',

	REMOVE_BOARD:         'REMOVE_BOARD',
	REMOVE_BOARD_SUCCESS: 'REMOVE_BOARD_SUCCESS',
	REMOVE_BOARD_FAILURE: 'REMOVE_BOARD_FAILURE',

	GENERATE_ACCESS_CODE:         'GENERATE_ACCESS_CODE',
	GENERATE_ACCESS_CODE_SUCCESS: 'GENERATE_ACCESS_CODE_SUCCESS',
	GENERATE_ACCESS_CODE_FAILURE: 'GENERATE_ACCESS_CODE_FAILURE',

	REVOKE_ACCESS_CODE:         'REVOKE_ACCESS_CODE',
	REVOKE_ACCESS_CODE_SUCCESS: 'REVOKE_ACCESS_CODE_SUCCESS',
	REVOKE_ACCESS_CODE_FAILURE: 'REVOKE_ACCESS_CODE_FAILURE',

	CHANGE_SETTING:    'CHANGE_SETTING',
	SET_ACTIVE_TICKET: 'SET_ACTIVE_TICKET',

	/**
	 * Generic event for all things error.
	 *
	 * @event FAILURE
	 *
	 * @type {object}
	 * @property {Error} error  The error object.
	 */
	FAILURE: 'FAILURE',

	/**
	 * Emitted when there is a 401 or a similar error.
	 *
	 * @event AUTHENTICATION_FAILURE
	 *
	 * @type {object}
	 * @property {Error} error  The error object.
	 */
	AUTHENTICATION_FAILURE: 'AUTHENTICATION_FAILURE',

	/**
	 * Base event for the login process.
	 *
	 * @event LOGIN
	 *
	 * @see event:LOGIN_SUCCESS
	 * @see event:LOGIN_FAILURE
	 */
	LOGIN: 'LOGIN',

	/**
	 * @event LOGIN_SUCCESS
	 *
	 * @type {object}
	 * @property {object} user   The logged in user.
	 * @property {string} token  The logged in user's access token.
	 */
	LOGIN_SUCCESS: 'LOGIN_SUCCESS',

	/**
	 * @event LOGIN_FAILURE
	 *
	 * @type {object}
	 * @property {Error} error  The error object.
	 */
	LOGIN_FAILURE: 'LOGIN_FAILURE',

	/**
	 * Base event for the logout process.
	 *
	 * @event LOGOUT
	 *
	 * @see event:LOGOUT_SUCCESS
	 * @see event:LOGOUT_FAILURE
	 */
	LOGOUT: 'LOGOUT',

	/**
	 * @event LOGOUT_SUCCESS
	 */
	LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',

	/**
	 * @event LOGOUT_FAILURE
	 *
	 * @type {object}
	 * @property {Error} error  The error object.
	 */
	LOGOUT_FAILURE: 'LOGOUT_FAILURE',

	/**
	 * Base event for the guest login process.
	 *
	 * @event LOGIN_GUEST
	 *
	 * @see event:LOGIN_GUEST_SUCCESS
	 * @see event:LOGIN_GUEST_FAILURE
	 */
	LOGIN_GUEST: 'LOGIN_GUEST',

	/**
	 * @event LOGIN_GUEST_SUCCESS
	 *
	 * @type {object}
	 * @property {object} user   The logged in guest.
	 * @property {string} token  The logged in guest's access token.
	 */
	LOGIN_GUEST_SUCCESS: 'LOGIN_GUEST_SUCCESS',

	/**
	 * @event LOGIN_GUEST_FAILURE
	 *
	 * @type {object}
	 * @property {Error} error  The error object.
	 */
	LOGIN_GUEST_FAILURE: 'LOGIN_GUEST_FAILURE',

	/**
	 * The base event for the register process.
	 *
	 * @event REGISTER
	 *
	 * @see event:REGISTER_SUCCESS
	 * @see event:REGISTER_FAILURE
	 */
	REGISTER: 'REGISTER',

	/**
	 * @event REGISTER_SUCCESS
	 *
	 * @type {object}
	 * @property {object} user  The created user.
	 */
	REGISTER_SUCCESS: 'REGISTER_SUCCESS',

	/**
	 * @event REGISTER_FAILURE
	 *
	 * @type {object}
	 * @property {Error} error  The error object.
	 */
	REGISTER_FAILURE: 'REGISTER_FAILURE',

	NEW_BROADCAST: 'NEW_BROADCAST',
	MARK_BROADCAST_AS_SEEN: 'MARK_BROADCAST_AS_SEEN',
}
