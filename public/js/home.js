/**
 * @author Admin
 */

var APP = {
	appId : "113414208819474",
	url : "http://localhost:3000"
};

$(document).ready(function() {
	var appId = "113414208819474";
	var url = "http://localhost:3000";
	load_FB_SDK(appId, url);
});

function load_FB_SDK(appId, url) {
	//Load the SDK's source Asynchronously
	( function(d, debug) {
			var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
			if (d.getElementById(id)) {
				return;
			}
			js = d.createElement('script');
			js.id = id;
			js.async = true;
			js.src = "//connect.facebook.net/en_US/all" + ( debug ? "/debug" : "") + ".js";
			ref.parentNode.insertBefore(js, ref);
		}(document, /*debug*/false));
	window.fbAsyncInit = function() {
		// init the FB JS SDK
		FB.init({
			appId : appId, // App ID from the App Dashboard
			channelUrl : url, // Channel File for x-domain communication
			status : true, // check the login status upon init?
			cookie : true, // set sessions cookies to allow your server to access the session?
			xfbml : true // parse XFBML tags on this page?
		});
		//auth change
		loginStatus();
	};
}

function loginStatus() {
	// listen for and handle auth.statusChange events
	FB.Event.subscribe('auth.statusChange', function(response) {
		if (response.authResponse) {
			// user has auth'd your app and is logged into Facebook
			login = true;
			console.log('login authenticated !');
			extractUserInterests();
		} else {
			alert('Authentication failed');
		}
	});
}

function extractUserInterests() {
	// get entertainment category user data
	extractEntertainmentCategory();
	
}

function extractEntertainmentCategory() {
	var fbEntertainmentCategory;
	var userData = [];
	$.get(APP.url + '/entertainment', function(result) {
		fbEntertainmentCategory = result.split(',');
		//console.log('result' + result);
	});
	FB.api('/me/likes', function(me) {
		if (me) {
			for (var i = 0; i < (me.data).length; i++) {
				// console.log(me.data[i].category);
				for (var j = 0; j < fbEntertainmentCategory.length; j++) {
					if (me.data[i].category == fbEntertainmentCategory[j]) {
						userData.push(me.data[i].name);
					}
				}
			}
			getUserRecommendations(userData);
		}
	});
}


function getUserRecommendations(userData) {
	$.post(APP.url + '/getRecommendedArticles', { userdata : userData}, function(arrObj) {
		
		for(var i = 0; i < 5; i ++) {
			var docId = arrObj["articleWeights"][i]["key"]; 
			var k=0;
			while(docId !== arrObj["articles"][k]["documentID"]) {
				k++;
			}  
			console.log(arrObj["articles"][k]["name"]);
			console.log(arrObj["articles"][k]["documentID"]);
		}
		//console.log(arrObj);
		 });
	// for(var i = 0; i < userData.length; i ++) {
		// console.log(userData[i]);	
	// }
}
