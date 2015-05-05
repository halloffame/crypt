// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require crypto
//= require jquery
//  require jquery_ujs
//= require angular
//= require angular-resource
//= require_tree .


function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}


// Initialize the angular application
cryptApp = angular.module('cryptApp', ['ngResource']);

// Configure angular application
cryptApp.config([
  "$httpProvider", "$locationProvider", function($httpProvider, $locationProvider) {
    // Rails expects a csrf token for form security. This tags it on to the request header.
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');

    // Use normal routing instead of the hash routing
    $locationProvider.html5Mode(true);
  }
]);

// Setup Message factory for creating and finding messages
cryptApp.factory('Message', function($resource) {
  return $resource('/api/messages/:id', {id: '@id'});
});

cryptApp.controller('CryptCtrl', ['$scope', '$location', 'Message', function($scope, $location, Message) {
  $scope.angular_loaded = true;  // This changes some css classes so we can show a landing screen before angular loads
  $scope.newly_created = false;  // Set to true after successfully creating a new message
  $scope.app_data = {};


  // Find or create $scope.message
  if(window.message_id) {
    $scope.angular_loaded = false; // Wait untill message successfully loads

    // Query the api for the message with the given message id
    $scope.message = Message.get({id: window.message_id}, function() {
      // On success
      $scope.angular_loaded = true;
    }, function() {
      // On error redirect to root url
      alert('This message no longer exists');
      window.location = '/'; // I actually want to force a page reload, otherwise I would use $location.path()
    });

    // Set passphrase if it is coming through in the location hash
    if (location.hash) {
      $scope.app_data.passphrase = decodeURI(location.hash.replace(/^#/, ''));
    };

  } else {
    // Create a new message object and generate a passphrase
    $scope.message = new Message();
    $scope.app_data.passphrase = guid();
  }



  // Cache $scope to be used in the below functions
  _scope = $scope;

  // Gets triggered when you click the "Encrypt" button on the home page
  $scope.encryptText = function() {
    // TODO: Maybe we should require a password?
    _scope.message.encrypted_text = CryptoJS.AES.encrypt(_scope.app_data.plain_text, _scope.app_data.passphrase).toString();

    _scope.message.$save(function(m) {
      _scope.message.id = m.id;
      _scope.newly_created = true;
    });
  };

  // Gets triggered when you click the "Decrypt" button on the message page
  $scope.decryptText = function(){
    _scope.app_data.decrypted_text = CryptoJS.AES.decrypt(_scope.message.encrypted_text, _scope.app_data.passphrase).toString(CryptoJS.enc.Utf8);

    // Show error if password is wrong.
    if (!_scope.app_data.decrypted_text) {
      _scope.decryption_error = "The passphrase is incorrect"
    }
  };

  $scope.destroyMessage = function() {
    _scope.message.$delete(function() {
      $scope.angular_loaded = false; // Blank out the screen before reload
      window.location = '/';
    }, function() {
      alert("There was a problem deleting the message");
    });
  }

  $scope.uriEncodedPassphrase = function() {
    return encodeURI(_scope.app_data.passphrase);
  };

}]);
