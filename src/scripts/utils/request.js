import request from 'request';

/**
 * Simple helper module to make HTTP requests.
 */
export default {
	get:  customRequest.bind(null, request.get),
	put:  customRequest.bind(null, request.put),
	del:  customRequest.bind(null, request.del),
	post: customRequest.bind(null, request.post)
}

/**
 * Simple helper function to make HTTP requests. Note that you don't call this
 * directly but instead use one of the pre-bound methods above.
 */
function customRequest(requestMethod, options = {}) {
	return new Promise((resolve, reject) => {
		let requestOptions = {
			withCredentials: false,
			headers: {
				'Accept':        'application/json',
				'Content-Type':  'application/json',
				'Authorization': `Bearer ${options.token}`
			},
			url:  options.url,
			body: options.payload ? JSON.stringify(options.payload) : null
		}
		requestMethod(requestOptions, (err, res, body) => {
			if(err) {
				return reject(err);
			}
			if(res.statusCode === 0 || res.statusCode >= 400) {
				var error            = new Error(res.message);
				    error.statusCode = res.statusCode;
				return reject(error);
			}
			if(res.headers['content-type'].includes('application/json')) {
				body = JSON.parse(body);
			}
			return resolve({ body, headers: res.headers });
		});
	});
}
