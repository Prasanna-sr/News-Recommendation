/**
 * @author Admin
 */

var mongodb = require('./mongodbLib');
module.exports = function(res, userData) {
	var df = {};
	var idf = {};
	var userfilteredData = preProcessUserData(userData);
	calculateWeight(userfilteredData);

	function preProcessUserData(userData) {
		var userFilteredData = [];
		for (var i = 0; i < userData.length; i++) {
			var filteredText = userData[i].replace(/[^a-zA-Z0-9\s]/g, "");
			filteredText = filteredText.replace('.', " ").toLowerCase();
			userFilteredData.push(filteredText);

		}
		return userFilteredData;
	}

	function calculateWeight(userData) {
		//for (var i = 0; i < userData.length; i++) {
		var invertedIndex
		mongodb.retrieveInvertedIndex(function(err, invertedIndex) {
			if (err) {

			} else {
				findSimilarity(userData, invertedIndex);

			}
		});
	}

	function findSimilarity(userData, invertedIndex) {
		var termFrequency = {};
		var docs;
		for (var i = 0; i < userData.length; i++) {
			docs = 0;
			var keywords = userData[i].split(' ');
			for (var j = 0; j < keywords.length; j++) {
				var keyword = keywords[j];
				if (invertedIndex[keyword]) {
					var objIndex = invertedIndex[keyword];
					for (docID in objIndex) {
						//to get number of documents matching for a keyword
						docs++;
						if (termFrequency[docID]) {
							termFrequency[docID] = termFrequency[docID] + objIndex[docID].count;
						} else {
							termFrequency[docID] = objIndex[docID].count;
						}
					}
				}
			}
			for (doc in termFrequency) {
				if (idf[doc]) {
					idf[doc] = idf[doc] + termFrequency[docID] + Math.log(68 / docs);
				} else {
					idf[doc] = termFrequency[docID] + Math.log(68 / docs);
				}
			}
			termFrequency = {};
		}
		var articleWeights = sortObject(idf);
		for(var k = 0; k < 5; k ++) {
			articleWeights[k]["key"] = parseInt(articleWeights[k]["key"]);
		}
		mongodb.retrieveArticles(articleWeights, function(err, arrArticles) {
			if(err) {
				
			} else {
				console.log('arrResult is : '+ JSON.stringify(arrArticles));
				res.send({articles : arrArticles, articleWeights : articleWeights});
			}
		});
	}

	

	function sortObject(obj) {
		var arr = [];
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				arr.push({
					'key' : prop,
					'value' : obj[prop]
				});
			}
		}
		arr.sort(function(a, b) {
			return b.value - a.value;
		});
		return arr;
		// returns array
	}

}
