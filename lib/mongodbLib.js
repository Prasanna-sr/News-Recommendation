/**
 * @author Admin
 */
var dbUtil = require('./cloudFoundryUtil');
module.exports = {
	connect: function(dbServiceName) {
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
    persistArticle : function(article, dtm, callback) {
    db.collection('articles');
    db.bind('articles');
    db.articles.update({name : article.title},{name : article.title, link : article.link, date : article.date.toString(), dtm : dtm},{upsert : true},function(err) {
    	if(err) {
    		callback(err);
    	} else {
    		callback('Articles persisted successfully');
    	}
    });
    }
	
	
}
