/**
 * Generates a random string prefixed with 'dirty_'. Meant to be used as an
 * identifier of sorts for resources optimistically created on the client.
 */
export default function uid() {
	return `dirty_${Math.random().toString(36).substr(2, 9)}`;
}
