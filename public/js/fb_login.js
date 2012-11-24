/**
 * @author Admin
 */

var APP = { appId : "113414208819474", url : "http://localhost:3000/"};
 
$(document).ready(function() {
	var redirecturl = APP.url + "home.html";
	var permissionList = "user_interests,user_likes,user_groups, user_location,user_status,user_hometown,user_groups,user_education_history," 
	+ "friends_interests,friends_likes,friends_location,friends_status,friends_hometown,friends_groups,friends_education_history";
	
	$("#login").click(function() {
		
		top.location = "https://www.facebook.com/dialog/oauth/?client_id=" + APP.appId + "&redirect_uri=" + redirecturl + "&state=No&scope=" + permissionList;

	});

});



