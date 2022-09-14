import { Result as YouTubeSR } from 'ytsr';

import { ytsearch } from '../../../utils/youtube/index';
import apps from '../../connection/index';
import * as _ from '../../../utils/helper/index';

const app = apps.client.get('path');

app.get('/search/yts', async (req, res) => {
	const results = {};

	if (!req.query.query) {
		res.send({
			status: false,
			message: 'please provide query',
		});
		return;
	}

	const limit = req.query.limit || 5;
	let queries = req.query.query.split(',');

	queries = _.removeDuplicates(queries);

	for (const query of queries) {
		const data: YouTubeSR = await ytsearch(query);

		if (!data) {
			results[query] = [];
		} else if (!results[query]) {
			results[query] = data.items.slice(0, limit);
		}
	}

	res.send(results);
});
