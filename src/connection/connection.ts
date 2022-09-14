/* global process */
import express from 'express';

const paths = new Map();

export const init = async () => {
	const app = express();
	const port = process.env.PORT || 3000;

	app.get('/doc', (req, res) => {
		res.json({
			message: 'Welcome',
		});
	});

	paths.set('path', app);

	await import('../path/index');

	app.listen(port, () => {
		console.log(`listening on port ${port}`);
	});
};

export default paths;
