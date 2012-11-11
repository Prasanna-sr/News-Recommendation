/**
 * @author Admin
 */
var request = require('request');
var feedparser = require('feedparser');
var mongodb = require('./mongodbLib');

mongodb.connect('mongodb-1');

module.exports = function(app) {

	// Or, you can give that URL to parseUrl()
	feedparser.parseUrl('http://feeds.mercurynews.com/mngi/rss/CustomRssServlet/568/200223.xml').on('article', callback);
	function callback(article) {
		calculateDocumentTermMatrix(article);
	}

	function calculateDocumentTermMatrix(article) {
		var dtm;
		var apiKey = '0af5ee49fb7491d337179773bce10cbc03c249d7';
		request.post('http://access.alchemyapi.com/calls/url/URLGetText?url=' + article.link + '&apikey=' + apiKey + '&outputMode=json', function(error, response, dataObj) {
			var obj = JSON.parse(dataObj);
			var articleText = JSON.stringify(obj.text);
			console.log('------------------------------');
			console.log('Article title : '+ article.title);
			console.log('original article length : ' + articleText.length);
			var filteredText = articleText.replace(/[^a-zA-Z0-9\s]/g, "");
			console.log('After non characters filtering : ' + filteredText.length);
			var arrObj = filteredText.split(" ");
			var finalArr = removeStopWords(arrObj);
			console.log('final array after stop words filtering : ' + finalArr.length);
			dtm = {};
			for (var i = 0; i < finalArr.length; i++) {
				var word = finalArr[i];
				if (dtm[word]) {
					dtm[word] = dtm[word] + 1;
				} else {
					dtm[word] = 1;
				}
			}
			mongodb.persistArticle(article, dtm, function(result) {
				console.log(result);
			});
		});
	}

	function removeStopWords(arrObj) {
		var fs = require('fs');
		var flag = 0;
		var finalArr = [];
		var arrStopWords = fs.readFileSync('./resources/stopwords.txt').toString().split("\n");
		for (var k = 0; k < arrObj.length; k++) {
			for (var i = 0; i < arrStopWords.length; i++) {
				if (arrObj[k].length < 2 || (arrObj[k].toLowerCase() == arrStopWords[i])) {
					flag = 1;
					break;
				}
			}
			if (flag !== 1) {
				finalArr.push(arrObj[k]);
			}
			flag = 0;
		}
		return finalArr;
	}

}