/**
 * @author Admin
 */

var mongodb = require('./mongodbLib');
module.exports = function(userData) {
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
				console.log('--dsf#@$%@#%$#%' + userData.toString());
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
				//j = "game";
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
					idf[doc] = idf[doc] + termFrequency[docID] + Math.log(8/docs);
				} else {
					idf[doc] = termFrequency[docID] + Math.log(8/docs);
				}

			}
			termFrequency = {};

			//var count = invertedIndex.userData[i];
		}

		console.log('term frequency' + termFrequency);
	}

}
