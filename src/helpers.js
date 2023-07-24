const filter = (chars, words, length) => {
	const res = {};
	const charsArr = Object.entries(chars);
	charsArr.forEach(([char, count]) => {
		words.forEach(({ word }) => {
			const occ = word.split(char).length - 1;
			if (occ && occ <= count) {
				res[word] = (res[word] || 0) + occ;
			}
		});
	});
	return Object.entries(res).reduce((acc, [word, count]) => {
		if (count >= length) acc.push(word);
		return acc;
	}, []);
};

module.exports.filterWords = ({ words, params, length }) => {
	let correctWords = [];
	if (params) {
		const charsObj = params.split("").reduce((acc, char) => {
			acc[char] = (acc[char] || 0) + 1;
			return acc;
		}, {});
		correctWords = filter(charsObj, words, length);
	} else {
		words.forEach(({ word }) => correctWords.push(word));
	}
	return correctWords.sort();
};

module.exports.parseQuery = (query) => {
	return { params: query.u };
};

module.exports.formatWord = (word) => word.trim().toLowerCase();
