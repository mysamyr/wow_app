const filter = (chars, words, length) => {
  const res = {};
  const minLength = Math.min(chars.length, length);
  chars.forEach(char => {
    words.forEach(({word}) => {
      const occ = word.split(char).length - 1;
      if (occ > 0) res[word] = (res[word] || 0) + occ;
    });
  });
  return Object.entries(res).reduce((acc, [word, count]) => {
    if (count >= minLength) acc.push(word);
    return acc;
  }, []);
};

module.exports.filterWords = ({words, keys, params, length}) => {
  let correctWords = [];
  if (keys.length) {
    keys.forEach(key => {
      words = words.filter(({word}) => word[key] === params[key].toLowerCase());
    });
  }
  if (params.u) {
    correctWords = filter(params.u.split(""), words, length);
  } else {
    words.forEach(({word}) => correctWords.push(word));
  }
  return correctWords.sort();
};

module.exports.parseQuery = (query) => {
  return {
    keys: Object.keys(query).filter(key => key !== "l" && key !== "u"),
    params: query,
    length: +query.l
  };
};
