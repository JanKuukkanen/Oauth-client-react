'use strict';

/**
 * Ticket 'color' definitions.
 */
module.exports.TicketColor = {
	RED:    '#eb584a',
	BLUE:   '#4f819a',
	VIOLET: '#724a7f',
	YELLOW: '#dcc75b',
}

/**
 * User 'type' definitions.
 */
module.exports.UserType = {
	USER:  'user',
	GUEST: 'guest',
}

/**
 *
 */
module.exports.Background = {
	/* jshint ignore:start */
	NONE:                  { description: 'Blank',                 url: null                                            },
	PLAY:                  { description: 'Play!',                 url: '/dist/assets/img/bg/play.png'                  },
	SWOT:                  { description: 'SWOT',                  url: '/dist/assets/img/bg/swot.png'                  },
	SCRUM:                 { description: 'Scrum',                 url: '/dist/assets/img/bg/scrum.png'                 },
	KANBAN:                { description: 'Kanban',                url: '/dist/assets/img/bg/kanban.png'                },
	KEEP_DROP_TRY:         { description: 'Keep, Drop, Try',       url: '/dist/assets/img/bg/keep_drop_try.png'         },
	CUSTOMER_JOURNEY_MAP:  { description: 'Customer Journey Map',  url: '/dist/assets/img/bg/customer_journey_map.png'  },
	BUSINESS_MODEL_CANVAS: { description: 'Business Model Canvas', url: '/dist/assets/img/bg/business_model_canvas.png' },
	/* jshint ignore:end */
}
