// This is a JavaScript file

// This is a JavaScript file
angular.module('app').factory('$localStorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {        
      $window.localStorage[key] = JSON.stringify(value);
      console.log('localStorage setObject : ' + key);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
      console.log('localStorage getObject : ' + key);
    }
  }
}]);