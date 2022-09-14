import fileSize from 'filesize-parser';
import ytsr, { Result } from 'ytsr';

import { YouTubeResultFields, YouTubeResultList, YouTubePromiseResultList, YouTubePromiseResultAudio } from '../types';
import { isURL, isYouTubeURL } from '../helper/function';

const URL_INFO = 'https://yt1s.com/api/ajaxSearch/index';
const URL_CONVERT = 'https://yt1s.com/api/ajaxConvert/convert';

const findHttpsRequestLib = async () => {
	const [fetch] = await Promise.all([(async () => await import('node-fetch'))().catch((err) => err)]);

	if (fetch) {
		return { fetch: fetch.default };
	}

	throw new Error('HTTPS Request Library not found. install node-fetch.');
};

export const ytsearch = async (query: string): Promise<Result> => {
	const search = await ytsr(query);

	return search;
};

const ytdl = async (query: string, type: string): Promise<YouTubePromiseResultList> => {
	try {
		const lib = await findHttpsRequestLib();

		let datas: YouTubeResultFields;

		if (lib.fetch) {
			datas = (await (
				await lib.fetch(URL_INFO, {
					method: 'POST',
					body: `q=${encodeURIComponent(query)}&vt=home`,
					headers: {
						Accept: 'application/json, text/plain, */*',
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				})
			).json()) as YouTubeResultFields;
		}

		const { k, size } =
			Object.values(datas.links[type]).filter((v) => (type == 'mp4' ? v.q == '480p' || v.q == '360p' : v.q == '128kbps' || v.q == `${128 / 2}kbps`)).length === 0
				? Object.values(datas.links[type])[Object.keys(datas.links[type]).length - 1]
				: Object.values(datas.links[type]).filter((v) => (type == 'mp4' ? v.q == '480p' || v.q == '360p' : v.q == '128kbps' || v.q == `${128 / 2}kbps`))[0];

		const data: YouTubeResultList = (await (
			await lib.fetch(URL_CONVERT, {
				method: 'POST',
				body: `vid=${datas.vid}&k=${encodeURIComponent(k)}`,
				headers: {
					Accept: 'application/json, text/plain, */*',
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			})
		).json()) as YouTubeResultList;

		return {
			filesizeF: size,
			filesize: fileSize(String(size).replace(' ', ''), { base: 2 }),
			dlink: data.dlink,
			title: data.title,
		};
	} catch (error) {
		return {
			status: false,
			message: 'Failed to gather information.',
		};
	}
};

export const yta = async (query: string): Promise<YouTubePromiseResultAudio | { status: boolean; message: string }> => {
	if (isURL(query) && !isYouTubeURL(query)) {
		return {
			status: false,
			message: 'Invalid YouTube URL.',
		};
	}

	if (isURL(query) && isYouTubeURL) {
		const data: any = await ytsearch(query);

		const dl = await ytdl(data.items[0].url, 'mp3');

		if (!dl.status) {
			return {
				status: false,
				message: 'Could not find available downloader.',
			};
		}

		return {
			...data,
			...dl,
		};
	}

	const data: any = await ytsearch(query);

	const dl = await ytdl(data.items[0].url, 'mp3');

	return {
		...data,
		...dl,
	};
};
