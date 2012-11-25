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
			description : article.description,
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
	},
	
	retrieveArticles : function(arrObj, callback) {
	db.collection('articles');
	db.bind('articles');
	db.articles.find({$or : [{"documentID": arrObj[0]["key"]},{"documentID": arrObj[1]["key"]},{"documentID": arrObj[2]["key"]},
	{"documentID": arrObj[3]["key"]},{"documentID": arrObj[4]["key"]}]}, function(err, cursor) {
		//db.articles.find({"documentID": id}, function(err, cursor) {
		if(err) {
			callback(err);
		} else {
			cursor.toArray(callback);
		}
	});	
	}
}
