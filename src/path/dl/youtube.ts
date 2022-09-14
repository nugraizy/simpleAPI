import { yta } from '../../../utils/youtube/index';
import apps from '../../connection/index';
import * as _ from '../../../utils/helper/index';

const app = apps.client.get('path');

app.get('/dl/yta', async (req, res) => {
	const results = {};

	if (!req.query.query) {
		res.send({
			status: false,
			message: 'please provide query',
		});
		return;
	}

	let queries = req.query.query.split(',');

	queries = _.removeDuplicates(queries);

	for (const query of queries) {
		const data: any = await yta(query);

		if (!data) {
			results[query] = [];
		} else if (!results[query]) {
			results[query] = { data: data.items[0], fileSize: data.filesize, fileSizeF: data.filesizeF, dlLink: data.dlink };
		}
	}

	res.send(results);
});
