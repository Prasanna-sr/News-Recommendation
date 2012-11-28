/**
 * @author Admin
 */
$("#listArticles1").live('click', function() {
	$('#iFrame1').attr('src', $(this).attr('data-identity'))
});

$("#listArticles2").live('click', function() {
	$('#iFrame2').attr('src', $(this).attr('data-identity'))
});

$(document).ready(function() {

	function populateList(listObj) {
		var name = (listObj.name).replace(/\'/g, '');
		$('#list1').append('<section ><article><a id="listArticles1" href="#" data-identity=' + listObj.link + '>' + name + '</a><details>Description :' + listObj.description + '<p>Date :' + listObj.date + '</p></details></article></section>');
	}

	function populateList_Friends(listObj) {
		var name = (listObj.name).replace(/\'/g, '');
		$('#list2').append('<section ><article><a id="listArticles2" href="#" data-identity=' + listObj.link + '>' + name + '</a><details>Description :' + listObj.description + '<p>Date :' + listObj.date + '</p></details></article></section>');
	}

	var APP = {
		appId : "113414208819474",
		url : "http://localhost:3000"
	};

	var appId = "113414208819474";
	var url = "http://localhost:3000";
	load_FB_SDK(appId, url);

	var fbEntertainmentCategory;
	var userData = [];
	var arrJaccard = [];

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
		$.get(APP.url + '/entertainment', function(result) {
			fbEntertainmentCategory = result.split(',');
			//console.log('result' + result);
		});
		FB.api('/me/likes', function(me) {
			if (me) {
				for (var i = 0; i < (me.data).length; i++) {
					for (var j = 0; j < fbEntertainmentCategory.length; j++) {
						if (me.data[i].category == fbEntertainmentCategory[j]) {
							userData.push(me.data[i].name);
						}
					}
				}
				getUserRecommendations(userData, 1);
				getInterestOfFriends();

			}
		});
	}

	function getInterestOfFriends() {
		var l = 0;
		FB.api('me/friends', function(list) {
			for (var i = 0; i < list.data.length; i++) {
				FB.api('/' + list.data[i].id + '/likes', function(likes) {
					var friendsData = [];
					for (var k = 0; k < (likes.data).length; k++) {
						for (var j = 0; j < fbEntertainmentCategory.length; j++) {
							if (likes.data[k].category == fbEntertainmentCategory[j]) {
								friendsData.push(likes.data[k].name);
							}
						}
					}

					var jaccardIndex = jaccardSimilarity(userData, friendsData);
					if (jaccardIndex) {
						arrJaccard.push({
							"key" : friendsData,
							"value" : jaccardIndex
						});
					}
					if (l === i - 1) {
						getTopFriends(arrJaccard);
					}
					l++;
				});
			}
		});
	}

	function getTopFriends(arrJaccard) {
		var arrTopFriends = [];
		arrJaccard.sort(function(a, b) {
			return b.value - a.value;
		});

		//taking top 5 friends
		for (var i = 0; i < 5; i++) {
			for (var j = 0; j < arrJaccard[i].key.length; j++) {
				arrTopFriends.push(arrJaccard[i]["key"][j]);
			}
		}
		var arrFriends = diffArray(arrTopFriends, userData);
		getUserRecommendations(arrFriends, 2);
		//console.log(arrTopFriends);
	}

	function diffArray(a, b) {
		var bObj = {};
		b.forEach(function(obj) {
			bObj[obj] = obj;
		});

		// Return all elements in A, unless in B
		return a.filter(function(obj) {
			return !(obj in bObj);
		});
	}

	function jaccardSimilarity(a, b) {
		var nonsimilar, similar, jaccard_similarity;
		similar = 0;
		max = Math.max(a.length, b.length);
		for (i in a) {
			for (j in b) {
				if (a[i] == b[j]) {
					similar++;
				}
			}
		}
		jaccard_similarity = similar / max;
		return jaccard_similarity;
	}

	function getUserRecommendations(userData, type) {
		$.post(APP.url + '/getRecommendedArticles', {
			userdata : userData
		}, function(arrObj) {
			for (var i = 0; i < 5; i++) {
				var docId = arrObj["articleWeights"][i]["key"];
				var k = 0;
				while (docId !== arrObj["articles"][k]["documentID"]) {
					k++;
				}
				if (type === 1) {
					populateList(arrObj["articles"][k]);
				} else {
					populateList_Friends(arrObj["articles"][k]);
				}

				//console.log(arrObj["articles"][k]["name"]);
				//console.log(arrObj["articles"][k]["documentID"]);
			}
		});
	}

});
