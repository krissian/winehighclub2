// This is a JavaScript file
//angular.module('app', ['onsen.directives']);
//ons.bootstrap('app', ['onsen','ngSanitize','ngCordova','ui.unique','downgularJS']);
ons.bootstrap('app', ['onsen','ngSanitize','ngCordova','ui.unique']);

angular.module('app')
    .filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);
    
angular.module('app').config( [
//    '$compileProvider', '$httpProvider', 'downgularFileToolsProvider',
'$compileProvider', '$httpProvider',
    function( $compileProvider, $httpProvider, downgularFileToolsProvider ) {
        //allow images to be loaded from filesystem
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|filesystem):|data:image\//);
        
        /* configure storage details*/
//        downgularFileToolsProvider.usePersistentMemory(true);
//        downgularFileToolsProvider.setStorageQuota(30*1024*1024);
    }
]);

/*
var module = ons.bootstrap('my-app', ['onsen']);


module.controller('MainController', function($scope, $http) {
  ons.ready(function() {
 
  });
  
    $scope.title = ' test 123';
  
});
*/
