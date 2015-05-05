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


cryptApp = angular.module('cryptApp', ['ngResource']);

cryptApp.config([
  "$httpProvider", function($httpProvider) {
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
  }
]);

cryptApp.factory('Message', function($resource) {
  return $resource('/api/messages/:id'); // Note the full endpoint address
});

cryptApp.controller('CryptCtrl', ['$scope', 'Message', function($scope, Message) {
  $scope.angular_loaded = true;

  if(window.message_id) {
    $scope.message = Message.get({id: window.message_id}, function() {});
  } else {
    $scope.message = new Message();
  }

  $scope.app_data = {};
  // $scope.plain_text = "";
  // $scope.passphrase = "";
  // $scope.encrypted_text = "";
  // $scope.decrypted_text = "";


  $scope.encryptText = function() {
    _scope = this;
    _scope.message.encrypted_text = CryptoJS.AES.encrypt(_scope.app_data.plain_text, _scope.app_data.passphrase).toString();

    _scope.message.$save(function(m) {
      _scope.message.id = m.id
      // _scope.app_data.encrypted_text = m.encrypted_text;
      // _scope.app_data.decrypted_text = CryptoJS.AES.decrypt(_scope.app_data.encrypted_text, _scope.app_data.passphrase).toString(CryptoJS.enc.Utf8);
    });
    // this.encrypted_text = CryptoJS.AES.encrypt(this.plain_text, this.passphrase).toString();
    // this.decrypted_text = CryptoJS.AES.decrypt(this.encrypted_text, this.passphrase).toString(CryptoJS.enc.Utf8);
  };

  $scope.decryptText = function(){
    _scope = this;
    _scope.app_data.decrypted_text = CryptoJS.AES.decrypt(_scope.message.encrypted_text, _scope.app_data.passphrase).toString(CryptoJS.enc.Utf8);
  }

}]);
