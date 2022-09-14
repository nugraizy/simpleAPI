export const removeDuplicates = (arr: Array<string | number>) => {
	if (!Array.isArray(arr)) {
		return [];
	}

	return [...new Set(arr)];
};

export const isURL = (input: string) => /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi.test(input);

export const isYouTubeURL = (url: string) => url.match(new RegExp(/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/, 'g'));
