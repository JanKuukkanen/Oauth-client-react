let uid = reqmod('utils/uid');

/**
 * The 'uid' utility generates a random ID, which can be used as a preliminary
 * ID attribute for various objects, before they get accepted in the server.
 */
describe('utils/uid', () => {
	it('should prefix the generated ID with \'dirty_\'', () => {
		return uid().should.startWith('dirty_');
	});
});
