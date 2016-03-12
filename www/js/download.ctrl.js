  angular.module('app').controller("main", ['$scope', 'downgularQueue', function($scope, downgularQueue) {
  
      var imagesQueue;
      var imageURLs = [
          "http://www.winehighclub.com/cms/images/stories/virtuemart/product/ducru-beaucaillou9.jpg",
          "http://www.winehighclub.com/cms/images/stories/virtuemart/product/gazin2.jpg"
                      ];
      $scope.view = {};

      $scope.view.images = [];
      $scope.view.downloadsStarted = false;

      var updateViewImages = function(fileDownload){
        $scope.view.images.push(fileDownload.fileUrl);
        $scope.$apply();
        console.log(JSON.stringify($scope.view.images));
      }

      $scope.startStop = function(){
        $scope.view.downloadsStarted = !$scope.view.downloadsStarted;
        if($scope.view.downloadsStarted)
          imagesQueue.startDownloading();
        else
          imagesQueue.stopDownloading();        
      }

      //add images to download
      $scope.init = function(){
        for(var i=0; i < imageURLs.length; i++){
          imagesQueue.addFileDownload({'imageId': i}, imageURLs[i], "");
        }
      };

      $scope.save = function(){
        imagesQueue.saveFileDownloads();
        console.log ('save');
      }  

      $scope.retrieve = function(){
        imagesQueue.loadFileDownloads();
        console.log ('retrieve');
        console.log ($scope.view.images.length);
      }    
      $scope.urlForImage = function(imageName) {
        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
        var trueOrigin = cordova.file.dataDirectory + name;
        return trueOrigin;
      }


      ons.ready(function (){
        imagesQueue = downgularQueue.build('images1', 'tempDir1', updateViewImages);

        //set pending downloads from local storage
        imagesQueue.loadFileDownloads();

      });
      
}]);

