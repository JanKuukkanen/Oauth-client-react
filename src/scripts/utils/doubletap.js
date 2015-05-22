import Hammer from 'hammerjs';

/**
 * Simple abstraction over creating a HammerJS element with a 'doubletap' event
 * already added, so it can be listened to.
 */
export default function doubletap(element) {
	let hammer = new Hammer.Manager(element);
	hammer.add(new Hammer.Tap({
		event:        'doubletap',
		taps:         2,
		interval:     500,
		threshold:    16,
		posThreshold: 16
	}));
	return hammer;
}
