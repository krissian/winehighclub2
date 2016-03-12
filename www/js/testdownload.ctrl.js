// This is a JavaScript file

angular.module('app').controller("testdownload", function($scope, $http, $filter, ConstantService, $localStorage, $cordovaFile,$cordovaFileTransfer, $q){
   vm = this;

function downloadImg($cordovaFileTransfer, $q, $scope){
    console.log("running testdownload controller");
    vm.images = [];
    
    var wines = $localStorage.getObject('wines');
    var wineDownloadTotal = wines.wines.length;
    var resources = [];
    for(var i=0; i < wines.wines.length; i++){
        resources.push(ConstantService.thumbnailURL + wines.wines[i].product_thumb_image);
    }

     
     resources.forEach(function(i,x) {
        var filename = i.split("/").pop();
        var targetPath = getDir + filename;
        var trustHosts = true
        var options = {};
        
        var promises = [];
        promises.push($cordovaFileTransfer.download(i, targetPath, {}, true)).then(function(result) {$timeout(function () {
                                  vm.downloadCount++;
                                  console.log('image downloaded : '+vm.downloadCount);
                                  vm.downloadProgress = Math.floor((vm.downloadCount / wineDownloadTotal) *100);                                   
                                  vm.downloadProgress = (vm.downloadCount / wines.wines.length) *100;
                                  //console.log('image downloaded : '+filename); 
                                  if (vm.downloadProgress > 99){                      
                                      vm.downloadReady = true;
                                      ConstantService.appInit = true;
                                  }
                                },1000)});
            
      $q.all(promises).then(function(res) {
        console.log("in theory, all done");
        for(var i=0; i<res.length; i++) {
          $scope.images.push(res[i].nativeURL);
        }
      });
});
};
   
function getDir(){
        //downloadFile(ConstantService.thumbnailURL+'latour3_150x150.jpg');
        //check OS and call different getFiles 
        //var d = $q.defer();
        try {
            if(!ons.platform.isAndroid() && !ons.platform.isIOS()){
              console.log('ons.platform.isWebView: do nothing');   
              vm.downloadProgress = 100;
              vm.downloadReady = true;
              //ConstantService.appInit = true;
            } 
            if(ons.platform.isAndroid()){
                console.log('ons.platform.isAndroid: go download');  
                //getAllFiles(cordova.file.dataDirectory);
                return cordova.file.dataDirectory
            } 
            if(ons.platform.isIOS()){
                console.log('ons.platform.isIOS: go download');                  
                //getAllFiles(cordova.file.cacheDirectory);
                //getAllFiles(cordova.file.documentsDirectory);
                return cordova.file.documentsDirectory;
            }
        //d.resolve();
        //return d.promise;
        } 
        catch (e) {
            console.log('An error has occured '+e.message);            
        }
        
    };   
   
    ons.ready(function($cordovaFileTransfer, $q, $scope){
        downloadImg($cordovaFileTransfer, $q, $scope);
    });
});