// This is a JavaScript file
angular.module('app').controller("refreshDataController", function($scope, $http, ConstantService, $q, $localStorage, $timeout, $cordovaFile, $cordovaFileTransfer, $interval ){
    var vm = this;
    var remoteFiles = [];
    vm.wineDownloadTotal = 0;
    vm.title = 'Refreshing data, <br>please wait a moment ...<br><br>It may take up to 10 minutes for first run.';
    vm.isOffline = false;
    vm.downloadReady = false;
    
    vm.isDebug = false;
    
    vm.fileFound = false;

    vm.downloadCount = 0;
    vm.downloadProgress = 0;
    
    vm.dlSuccessCount = 0;
    vm.dlFailCount = 0;
    vm.dlExistCount = 0;
    
    vm.progress = 0;
    //vm.jsonDownloadTotal = jsonURL.length;
    vm.jsonDownloadProgress = 0;    
    vm.jsonDownloadTotal = 7;
    
    ons.ready(function(){
            vm.init();
    });
    
//    function forceRefresh(){
//        console.log("vm.forceRefresh");
//        vm.isOffline = false;
//        vm.downloadReady = false;
//        vm.init();
//    };
    
    vm.callAtInterval = function() {
        console.log("vm.callAtInterval - Interval occurred");
        if (ConstantService.appInit = true){
        vm.downloadCount = 0;
        vm.downloadProgress = 0;
        vm.jsonDownloadProgress = 0;
        vm.isOffline = true;
        vm.init();
        }
    }
    
    $interval( function(){ vm.callAtInterval(); }, 5*60*1000);
    
    vm.getMeOffline =function($scope){
        console.log('getMeOffline');
        vm.downloadReady = true;
        ConstantService.appInit = true;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        ConstantService.localImgURL = fileSystem.root.toURL();
        console.log('ConstantService.localImgURL: '+ConstantService.localImgURL);
        },
        function(error) { // error callback for #requestFileSystem
           console.log('Error with #requestFileSystem method.', error);
        });
        
    }
    
    vm.retry = function($scope){
        vm.init();
    }
    
    
    //start test download mgr

    //end test download mgr
    
    vm.init = function($scope){
    
        vm.failed = false;        
        vm.isFetching = true;

        //wine from local to localstorage
        //var tmpWine = angular.fromJson(vm.docroot+'wines.json');
        //$localStorage.setObject('wines',tmpWine);

            //getJSON('/wines.json','wines');
            //highlights
            getJSON('/winesbyCatID.json?cat_id='+80004,'winesbyCatID_80004',true);
            getJSON('/winesbyCatID.json?cat_id='+80003,'winesbyCatID_80003',true);
            getJSON('/winesbyCatID.json?cat_id='+80002,'winesbyCatID_80002',true);
            getJSON('/winesbyCatID.json?cat_id='+80001,'winesbyCatID_80001',true);
            getJSON('/winesByCat.json','winesByCat',false);
            //getJSON('/winesByCat.json','winesByCat',true);
            getJSON('/productscat.json','productscat',true);
            //getProductsCatJSON();
            
                
            $q.when()
            .then(function () {
              var deferred = $q.defer();
              
              //console.log('1st function called');
              $timeout(function () { 
                  //getJSON('/wines.json','wines');
                  //console.log('1st function called'+Date.now());
                  //deferred.resolve();
                  $http({
                        method: 'GET',
                        url: ConstantService.wsURL + '/wines.json',
                        cache: false
                      }).success( function(response){              
                        if (response) {                        
                            var items = response.data;
                        }
                        //vm.feeds = data.jsonFlickrFeed;
                        vm.feeds = items;
                        vm.isFetching = false;
                        vm.failed = false;
                        $localStorage.setObject('wines',items);
                        vm.isOffline = false;
                        //console.log('refreshDataController success');
                        //console.log("data = " + JSON.stringify(vm.feeds.productscat));
                        //console.log("data = " + print(vm.feeds));
                         $timeout(function () {
                              //vm.jsonDownloadProgress = (progress.loaded / progress.total) * 100;                          
                              vm.progress++;
                              //console.log('json downloaded : '+vm.progress);
                              vm.jsonDownloadProgress = Math.floor((vm.progress / vm.jsonDownloadTotal) *100);    
                              deferred.resolve();
                              //vm.jsonDownloadProgress = (vm.progress / jsonURL.length) *100;
                              })
                        
                    });
              });
              return deferred.promise;
            })
            .then(function () { 
                //console.log('getImg called'+Date.now());                
                $timeout(function () { 
                    getImg();
                    
                });                
                
            }).finally(function(){ 
                //window.location.reload(true);    
            });

        
        };
    function getJsonFile(){
        //downloadFile(ConstantService.thumbnailURL+'latour3_150x150.jpg');
        //check OS and call different getFiles 
        try {
            if(!ons.platform.isAndroid() && !ons.platform.isIOS()){
              console.log('ons.platform.isWebView: do nothing');   
              vm.jsonDownloadProgress = 100;
              vm.downloadProgress = 100;
              vm.downloadReady = true;
              ConstantService.appInit = true;
            } 
            if(ons.platform.isAndroid()){
                console.log('ons.platform.isAndroid: go download');  
                getJsonLocal(cordova.file.dataDirectory);   
            } 
            if(ons.platform.isIOS()){
                console.log('ons.platform.isIOS: go download');                  
                //getAllFiles(cordova.file.cacheDirectory);
                getJsonLocal(cordova.file.documentsDirectory);
            }
        } 
        catch (e) {
            console.log('An error has occured '+e.message);            
        }
        
    };
var errorHandler = function (fileName, e) {  
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'Storage quota exceeded';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'File not found';
            break;
        case FileError.SECURITY_ERR:
            msg = 'Security error';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'Invalid modification';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'Invalid state';
            break;
        default:
            msg = 'Unknown error';
            break;
    };

    console.log('Error (' + fileName + '): ' + msg);
}

function writeToFile(fileName, data) {
        //data = JSON.stringify(data, null, '\t');
        data = JSON.stringify(data);
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            window.resolveLocalFileSystemURL(fileSystem.root.toURL(), function (directoryEntry) {
                directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
                    fileEntry.createWriter(function (fileWriter) {
                        fileWriter.onwriteend = function (e) {
                            // for real-world usage, you might consider passing a success callback
                            console.log('Write of file "' + fileName + '"" completed.');
                        };
    
                        fileWriter.onerror = function (e) {
                            // you could hook this up with our global error handler, or pass in an error callback
                            console.log('Write failed: ' + e.toString());
                        };
    
                        var blob = new Blob([data], { type: 'text/plain' });
                        fileWriter.write(blob);
                    }, errorHandler.bind(null, fileName));
                }, errorHandler.bind(null, fileName));
            }, errorHandler.bind(null, fileName));
        });
}


    function getImg(){
        //check OS and call different getFiles 

        try {
            if(!ons.platform.isAndroid() && !ons.platform.isIOS()){
              console.log('ons.platform.isWebView: do nothing');   
              vm.downloadProgress = 100;
              vm.downloadReady = true;
              ConstantService.appInit = true;
            } 
            if(ons.platform.isAndroid()){
                console.log('ons.platform.isAndroid: go download');  
                getAllFiles(cordova.file.dataDirectory);   
            } 
            if(ons.platform.isIOS()){
                console.log('ons.platform.isIOS: go download');                  
                //getAllFiles(cordova.file.cacheDirectory);
                getAllFiles(cordova.file.documentsDirectory);
            }

        } 
        catch (e) {
            console.log('An error has occured '+e.message);            
        }
        
    };
    function getJSON($url, $localkey, $saveLocalStorage){
        $http({
            method: 'GET',
            url: ConstantService.wsURL + $url,
            cache: false
          }).success( function(response){              
                    if (response) {                        
                        var items = response.data;
                    }
                    //vm.feeds = data.jsonFlickrFeed;
                    vm.feeds = items;
                    vm.isFetching = false;
                    vm.failed = false;
                    if($saveLocalStorage){
                        $localStorage.setObject($localkey,items);
                    } else {
                        //winesByCat
                        ConstantService.winesByCat = JSON.stringify(items);
                        //writeToFile('winesByCat.json',items);
                        downloadWinesJSON();
                        //save to localfile
                        //not working on iOS
                        /*
                        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                            ConstantService.localImgURL = fileSystem.root.toURL();
                            $cordovaFile.writeFile(fileSystem.root.toURL(),'winesByCat.json',JSON.stringify(items),{append:false})
                              .then(function (success) {
                                console.log("success the file has been created")
                              }, function (error) {
                                console.log("error"+JSON.stringify(error))
                              });
                        });
                        */
                    }
                    vm.isOffline = false;
                    //console.log('refreshDataController success');
                    //console.log("data = " + JSON.stringify(vm.feeds.productscat));
                    //console.log("data = " + print(vm.feeds));
                     $timeout(function () {
                          //vm.jsonDownloadProgress = (progress.loaded / progress.total) * 100;                          
                          vm.progress++;
                          //console.log('json downloaded : '+vm.progress);
                          vm.jsonDownloadProgress = Math.floor((vm.progress / vm.jsonDownloadTotal) *100);                          
                          //vm.jsonDownloadProgress = (vm.progress / jsonURL.length) *100;
                          })
                    
                })
            .error(function(error){                    
                    vm.failed = true;                                   
                    vm.isFetching = false;   
                    vm.feeds = $localStorage.getObject($localkey);
                    vm.isOffline = true;
                    console.log('refreshDataController failed');
                });
        return vm.feeds;
    };

    function getAllFiles($docroot){
        var wines = $localStorage.getObject('wines');        
        
        var thumbnailURL = [];
        var imageURL = [];
               
        for(var i=0; i < wines.wines.length; i++){
        //for(var i=0; i < 10; i++){
            thumbnailURL.push(ConstantService.thumbnailURL +wines.wines[i].product_thumb_image);
            imageURL.push(ConstantService.productImgURL + wines.wines[i].product_full_image);
            remoteFiles.push(ConstantService.thumbnailURL +wines.wines[i].product_thumb_image);
            remoteFiles.push(ConstantService.productImgURL + wines.wines[i].product_full_image);
        }        
        
        vm.wineDownloadTotal = thumbnailURL.length + imageURL.length;
        console.log ('file to download:'+vm.wineDownloadTotal);
        downloadFile();
//then(function(){
//            if (vm.wineDownloadTotal == 0 || vm.downloadProgress > 99){
//            vm.downloadReady = true;
//            ConstantService.appInit = true;
//            d = new Date();
//            ConstantService.appLastSync = d.toString();
//            console.log(ConstantService.appLastSync);
//        }
//        });
/*                
        var promises = [];
        

        thumbnailURL.forEach(function(i,x) {
            var filename = i.split("/").pop();
            var targetPath = $docroot + filename;
            var trustHosts = true
            var options = {Connection: "close"};
            
            //uri = encodeURI(i);            
            
            
            promises.push($cordovaFileTransfer.download(i, targetPath, options, trustHosts)
                .then(function(result) {
                    vm.downloadCount++;
                    
                    vm.downloadProgress = Math.floor((vm.downloadCount / wineDownloadTotal) *100);                                   
                    
                }, function(error) {
                    vm.downloadCount++;
                    console.log('image downloaded failed: '+vm.downloadCount + filename);
                    console.log("An error has occurred: Code = " + error.code + error.source + error.target);
                    
                })
            );
        });


        $q.all(promises).then(function(res) {
            console.log("thumbnail, all done");
//            if (vm.downloadProgress > 99 || wineDownloadTotal == 0){                      
//                      vm.downloadReady = true;
//                      ConstantService.appInit = true;
//                    }
        });

        
                
        var promisesImg = [];

        imageURL.forEach(function(i,x) {
            var filename = i.split("/").pop();
            var targetPath = $docroot + filename;
            var trustHosts = true
            var options = {Connection: "close"};
            
            //uri = encodeURI(i);
            
            promisesImg.push($cordovaFileTransfer.download(i, targetPath, options, trustHosts)
                .then(function(result) {
                    vm.downloadCount++;
                    //console.log('image downloaded : '+vm.downloadCount);
                    vm.downloadProgress = Math.floor((vm.downloadCount / wineDownloadTotal) *100);                                   
                    
                }, function(error) {
                    vm.downloadCount++;
                    console.log('image downloaded failed: '+vm.downloadCount + filename);
                    console.log("An error has occurred: Code = " + error.code + error.source + error.target);
                })
            );
        });

        $q.all(promisesImg).then(function(res) {
            console.log("Image, all done");
            vm.downloadReady = true;
            ConstantService.appInit = true;
            //for(var i=0; i<res.length; i++) {
            //$scope.images.push(res[i].nativeURL);
            //}
        });
*/                
//        if (wineDownloadTotal == 0 || vm.downloadProgress > 99){
//            vm.downloadReady = true;
//            ConstantService.appInit = true;
//        }

    }
    
    function getJsonLocal($docroot){
        var jsonURL = [
            ConstantService.wsURL +'/wines.json',
            ConstantService.wsURL +'/winesbyCatID.json?cat_id='+80004,
            ConstantService.wsURL +'/winesbyCatID.json?cat_id='+80003,
            ConstantService.wsURL +'/winesbyCatID.json?cat_id='+80002,
            ConstantService.wsURL +'/winesbyCatID.json?cat_id='+80001,
            ConstantService.wsURL +'/productscat.json'
            ];
            
        var jsonName = [
            'wines.json',
            'winesbyCatID_'+80004+'.json',
            'winesbyCatID_'+80003+'.json',
            'winesbyCatID_'+80002+'.json',
            'winesbyCatID_'+80001+'.json',
            'productscat.json'
            ]; 
        var cacheName = [
            'wines',
            'winesbyCatID_'+80004,
            'winesbyCatID_'+80003,
            'winesbyCatID_'+80002,
            'winesbyCatID_'+80001,
            'productscat'
            ];             
        var promises3 = [];

        jsonURL.forEach(function(i,x) {
            var filename = jsonName[x];
            var targetPath = $docroot + filename;
            var trustHosts = true
            var options = {};
            console.log('to be download : '+x+filename);
            promises3.push($cordovaFileTransfer.download(i, targetPath, options, trustHosts)
                    .then(function(result) {
                    // Success!
                        console.log(JSON.stringify(result));
                        $timeout(function () {
                          //vm.jsonDownloadProgress = (progress.loaded / progress.total) * 100;                          
                          vm.progress++;
                          console.log('json downloaded : '+vm.progress);
                          vm.jsonDownloadProgress = Math.floor((vm.progress / jsonURL.length) *100);                          
                          //vm.jsonDownloadProgress = (vm.progress / jsonURL.length) *100;
                          })
                      }, function(error) {
                        // Error
                        console.log(JSON.stringify(error));
                      }, function (progress) {   
                          /*$timeout(function () {
                          //vm.jsonDownloadProgress = (progress.loaded / progress.total) * 100;
                          console.log('json downloaded : '+vm.progress);
                          vm.progress++;
                          vm.jsonDownloadProgress = Math.floor((vm.progress / jsonURL.length) *100);                          
                          //vm.jsonDownloadProgress = (vm.progress / jsonURL.length) *100;
                          })*/
                    })
                );                    
        });
    }
    
    function getProductsCatJSON(){
        $q.when()
            .then(function () {
              var deferred = $q.defer();
              
              //console.log('1st function called');
              $timeout(function () { 
                  //getJSON('/wines.json','wines');
                  //console.log('1st function called'+Date.now());
                  //deferred.resolve();
                  $http({
                        method: 'GET',
                        url: ConstantService.wsURL + '/productscat.json',
                        cache: false
                      }).success( function(response){              
                        if (response) {                        
                            var items = response.data;
                        }
                        //vm.feeds = data.jsonFlickrFeed;
                        vm.feeds = items;
                        vm.isFetching = false;
                        vm.failed = false;
                        $localStorage.setObject('productscat',items);
                        
                        var tmp = $localStorage.getObject('productscat');
                        for(var i=0; i < tmp.productscat.length; i++){
                            getJSON('/winesbyCatID.json?cat_id='+tmp.productscat[i].cat_id,'winesbyCatID'+tmp.productscat[i].cat_id,true);
                        }
                        
                        vm.isOffline = false;
                        //console.log('refreshDataController success');
                        //console.log("data = " + JSON.stringify(vm.feeds.productscat));
                        //console.log("data = " + print(vm.feeds));
                         $timeout(function () {
                              //vm.jsonDownloadProgress = (progress.loaded / progress.total) * 100;                          
                              vm.progress++;
                              //console.log('json downloaded : '+vm.progress);
                              vm.jsonDownloadProgress = Math.floor((vm.progress / vm.jsonDownloadTotal) *100);    
                              deferred.resolve();
                              //vm.jsonDownloadProgress = (vm.progress / jsonURL.length) *100;
                              })
                        
                    });
              });
              return deferred.promise;
            });
    }
    
    function fileIsFound(){
        vm.fileFound = true;
    }
    function fileNotFound(){
        vm.fileFound = false;
    }
    function downloadFile() {
        // No files left, stop downloading
        //console.log('downloadFile remoteFiles.length: '+remoteFiles.length);
        if (remoteFiles.length == 0) {
            vm.downloadReady = true;
            ConstantService.appInit = true;
            d = new Date();
            $localStorage.setObject('appLastSync',d.toString());
            //console.log(d.toString());
            //console.log('Total Success/Fail/Exists :' + vm.dlSuccessCount + '/' + vm.dlFailCount + '/' + vm.dlExistCount);
            return;
        }
        var trustHosts = true
        var options = {Connection: "close"};
        
        var remoteFile = remoteFiles.pop();
        var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);
        
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
//            fileSystem.root.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
            window.resolveLocalFileSystemURL(fileSystem.root.toURL() + localFileName,
            function(fileEntry){
                //file exists
                $timeout(function () {
                ConstantService.localImgURL = fileSystem.root.toURL();
                vm.downloadCount++;
                vm.downloadProgress = Math.floor((vm.downloadCount / vm.wineDownloadTotal) *100);                                   
                //console.log('image downloaded success: '+vm.downloadCount);
                vm.dlExistCount++;
                downloadFile();
                });
            },function(){
                //var localPath = fileEntry.fullPath;
                var localPath = fileSystem.root.toURL() + localFileName;
                $cordovaFileTransfer.download(remoteFile, localPath, options, trustHosts)
                //ft.download(remoteFile, localPath, options, trustHosts)
                .then(function(result) {
                    $timeout(function () {
                    vm.downloadCount++;
                    vm.dlSuccessCount++;
                    vm.downloadProgress = Math.floor((vm.downloadCount / vm.wineDownloadTotal) *100);                                   
                    //console.log('image downloaded success: '+vm.downloadCount);
                    downloadFile();
                    });
                }, function(error) {
                    //vm.downloadCount++;
                    $timeout(function () {
                    console.log('image downloaded failed: '+vm.downloadCount);
                    console.log("An error has occurred: Code = " + error.code + error.source + error.target);
                    remoteFiles.push(remoteFile);
                    vm.dlFailCount++;
                    downloadFile();
                    });
                    
                });
      },

    function(error) { // error callback for #requestFileSystem
       console.log('Error with #resolveLocalFileSystemURL method.', error.code);
    });
    },
    function(error) { // error callback for #requestFileSystem
       console.log('Error with #requestFileSystem method.', error);
    });
    }


    function downloadWinesJSON() {
        // No files left, stop downloading
        //console.log('downloadFile remoteFiles.length: '+remoteFiles.length);
    
        var trustHosts = true
        var options = {Connection: "close"};
        
        var remoteFile = ConstantService.wsURL + '/winesByCat.json';
        var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);
        
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
//            fileSystem.root.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
            window.resolveLocalFileSystemURL(fileSystem.root.toURL() + localFileName,
            function(fileEntry){
                //file exists
                var localPath = fileSystem.root.toURL() + localFileName;
                $cordovaFileTransfer.download(remoteFile, localPath, options, trustHosts)
                //ft.download(remoteFile, localPath, options, trustHosts)
                .then(function(result) {
                    console.log('winesByCat.json downloaded');
                }, function(error) {
                    //vm.downloadCount++;
                    $timeout(function () {
                    console.log("An error has occurred: Code = " + error.code + error.source + error.target);
                    downloadWinesJSON();
                    });
                    
                });
            },function(){
                //var localPath = fileEntry.fullPath;
                var localPath = fileSystem.root.toURL() + localFileName;
                $cordovaFileTransfer.download(remoteFile, localPath, options, trustHosts)
                //ft.download(remoteFile, localPath, options, trustHosts)
                .then(function(result) {
                    console.log('winesByCat.json downloaded');
                }, function(error) {
                    //vm.downloadCount++;
                    $timeout(function () {
                    console.log("An error has occurred: Code = " + error.code + error.source + error.target);
                    downloadWinesJSON();
                    });
                    
                });
      },

    function(error) { // error callback for #requestFileSystem
       console.log('Error with #resolveLocalFileSystemURL method.', error.code);
    });
    },
    function(error) { // error callback for #requestFileSystem
       console.log('Error with #requestFileSystem method.', error);
    });
    }
});