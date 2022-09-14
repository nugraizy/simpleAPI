import { Result } from 'ytsr';

export interface YouTubeResultFields {
	links: { [type: string]: { q: string; k: string; size: string | number }[] };
	vid: string;
}

export interface YouTubeResultList {
	dlink?: string;
	title?: string;
}

export interface YouTubePromiseResultList extends YouTubeResultList {
	filesizeF?: string | number;
	filesize?: number;
	status?: boolean;
	message?: string;
}

export interface YouTubePromiseResultAudio extends Result {
	status?: boolean;
	message?: string;
}
