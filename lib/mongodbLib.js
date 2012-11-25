/**
 * @author Admin
 */
var dbUtil = require('./cloudFoundryUtil');
module.exports = {
	connect : function(dbServiceName) {
		db = dbUtil.connect('mongodb', dbServiceName);
		db.open(function(err, connection) {
			if (err || !connection) {
				console.log('Could not connect to MongoDB');
			} else {
				console.log('Connected to MongoDB successfully');
				conn = connection;
			}
		});
	},
	persistArticle : function(article, documentID, callback) {
		db.collection('articles');
		db.bind('articles');
		db.articles.update({
			documentID : documentID
		}, {
			documentID : documentID,
			name : article.title,
			link : article.link,
			date : article.date.toString(),
		}, {
			upsert : true
		}, function(err) {
			if (err) {
				callback(err);
			} else {
				callback('Articles persisted successfully');
			}
		});
	},
	persistInvertedIndex : function(invertedIndex, callback) {
		db.collection('index');
		db.bind('index');
		db.index.insert(invertedIndex, function(err) {
			if (err) {
				callback(err);
			} else {
				callback('Index persisted successfully');
			}
		});
	},
	
	retrieveInvertedIndex : function(callback) {
		db.collection('index');
		db.bind('index');
		db.index.findOne({}, function(err, document) {
			if (err) {
				callback(err);
			} else {
				callback(null, document);
			}
		});
	}
}
