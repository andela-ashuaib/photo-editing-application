/* global FB: true, $:true */
$.ajaxSetup({
  headers: {
    'X-CSRFToken': $('meta[name="csrf-token"]').attr('content')
  }
});

/**
 * Sends the user instance to django backend for registeration or login.
 * @param {object} user The response object.
 */
function socialLogin(user) {
  var ajaxInfo = {
    url: '/login',
    type: 'POST',
    data: user,
    success: function(data) {
      if (data === 'success') {
        window.location.href = '/dashboard';
      }
    },
    error: function(error) {
      console.log(error.responseText);
    }
  };
  $.ajax(ajaxInfo);
}

var facebookLogin = {
    // the configurable input for the facebook login literal
  config: {
    login: '#facebook-login'
  },
  // This extends the input of the user and execute the login property
  init: function(config) {
    $(facebookLogin.config.login).attr('disabled', true);
    if (config && typeof (config) === 'object') {
      $.extend(facebookLogin.config, config);
    }
    $.getScript('//connect.facebook.net/en_US/sdk.js', function() {
      FB.init({
        appId: facebookLogin.config.fbId,
        version: 'v2.5'
      });
      $(facebookLogin.config.login).attr('disabled', false);
    });
    $(facebookLogin.config.login).click(function(e) {
      e.preventDefault();
      facebookLogin.login();
    });
  },
  // recieve the user information from the facebook and sends it to our socialLogin(user)
  login: function() {
    FB.login(function(response) {
      if (response.authResponse) {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me?fields=email,first_name,last_name,picture',
            socialLogin);
      } else {
        console.log('Not logged in');
      }
    }, {
      scope: 'email,user_likes'
    });
  }
};

$(document).ready(function() {
  facebookLogin.init({
    fbId: $('meta[name="fb-id"]').attr('content'),
    login: '#facebook-login'
  });
});

