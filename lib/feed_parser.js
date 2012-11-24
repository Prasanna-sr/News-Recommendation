/**
 * @author Admin
 */
var request = require('request');
var feedparser = require('feedparser');
var mongodb = require('./mongodbLib');

mongodb.connect('mongodb-1');

module.exports = function(app) {
	var documentArray = [];
	//get feeds every 30 minutes
	setInterval(getFeeds, 3000);
	function getFeeds() {
		console.log('---------------------------------feeds-----------------------------------------------------------');

		//feedparser.parseUrl('http://www.usnews.com/rss/news').on('article', callback);
		//feedparser.parseUrl('http://rss.cnn.com/rss/edition_entertainment.rss').on('article', callback);
		feedparser.parseUrl('http://feeds.mercurynews.com/mngi/rss/CustomRssServlet/568/200223.xml').on('article', callback);
		function callback(article) {
			if (article && article.title) {
				calculateDocumentTermMatrix(article);
			}

		}

	}

	// feedparser.parseUrl('http://feeds.mercurynews.com/mngi/rss/CustomRssServlet/568/200223.xml').on('end', callback1);
	// function callback1(article) {
	// console.log('-----------------------------------------');
	// console.log('completed !!!!!!!!!!!');
	// }

	function calculateDocumentTermMatrix(article) {
		var dtm;
		var apiKey = '0af5ee49fb7491d337179773bce10cbc03c249d7';
		request.post('http://access.alchemyapi.com/calls/url/URLGetText?url=' + article.link + '&apikey=' + apiKey + '&outputMode=json', function(error, response, dataObj) {
			var k;
			var obj = JSON.parse(dataObj);
			var articleText = JSON.stringify(obj.text);
			//if (articleText) {
				console.log('------------------------------');
				console.log('Article title : ' + article.title);
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
				documentArray[k] = finalArr;
				k++;
				mongodb.persistArticle(article, dtm, function(result) {
					console.log(result);
				});
			//}
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