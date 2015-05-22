import path    from 'path';
import express from 'express';

express()
	// Serve the 'dist' directory of the project as static content.
	.use('/dist', express.static(path.join(__dirname, '../dist')))

	// All other requests will be routed to 'index.html'.
	.get('*', (req, res) => {
		return res.sendFile(path.join(__dirname, '../index.html'));
	})

	// Start the server at the given 'PORT'.
	.listen(process.env.PORT, () => {
		console.log('Server started at', process.env.PORT);
	});
