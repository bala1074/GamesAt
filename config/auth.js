// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID'        : '1927725977456319', // your App ID
		'clientSecret'    : 'fa560ca39f8cfb0277b5ef5594621731', // your App Secret
		'callbackURL'     : 'http://localhost:2020/auth/facebook/callback',
		'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'

    	},

	'twitterAuth' : {
		'consumerKey' 		: 'your-consumer-key-here',
		'consumerSecret' 	: 'your-client-secret-here',
		'callbackURL' 		: 'http://localhost:2020/auth/twitter/callback'
	},

    'googleAuth' : {
        'clientID' 		: '340304093393-j38l6754jqg7pv1rd08mug9i8jmpvn29.apps.googleusercontent.com',
        'clientSecret' 	: 'ISEq5NozhkiQcG_46wu7B4o3',
        'callbackURL' 	: 'http://localhost:2020/auth/google/callback'
    }

};
