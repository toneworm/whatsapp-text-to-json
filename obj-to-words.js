'use strict';
const fs = require('fs');
const file = process.argv[2];
const nonChars = /[\.,"!\?£\$%\^&\*\|\(\)~\=\+\[\]\/\\;:@#\{\}<>`0-9\-]/g;
const spacesRe = /\s+/g;
const filterWordsArr = ['and','that','get','what','for','you','this','was','have','with','are','good','the','yeh','yeah','got','now','not','can','too','like','all','but'];
let data;
let words = [];

if (file) {
  fs.readFile(file, 'utf8', (err, res) => {
    if (err) {
      throw err;
    }

    data = JSON.parse(res).data;

    init();
  });
}

const init = () => {

  data = stripActions(data);

  let wordsTxt = data.reduce((arr, item) => {
      return arr.concat(item.message);
    }, [])
    .join(' ')
    .replace(nonChars, ' ')
    .replace(spacesRe, ' ')
    .toLowerCase();

  words = wordsTxt.split(' ')
    .filter(filterWords);

  words = words.reduce((obj, item) => {
    if (item[0] === '\'') {
      item = item.slice(1);
    } else if (item[item.length - 1] === '\'') {
      item = item.slice(0, -1);
    }

    console.log(item);

    if (!obj[item]) {
      obj[item] = 1;
    }

    obj[item] += 1;

    return obj;
  }, {});

  const jsonUrl = `${file.slice(0, -5)}_words.json`;

  fs.writeFile(jsonUrl, JSON.stringify({ data: words }), (err) => {
    if (err) {
      throw err;
    }
    console.log(`Written to ${jsonUrl}`);
  });
};

const filterWords = (word) => {
  return word.length > 2
    && word.length < 20
    && filterWordsArr.indexOf(word) === -1;
};

const stripActions = (data) => {
  return data.filter(i => i.type !== 'action');
};
