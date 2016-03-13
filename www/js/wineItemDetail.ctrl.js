/*Controller: Second level wine category*/
angular.module('app').controller("wineItemDetailController", function($scope, $http, $filter, ConstantService, $cordovaFile, $localStorage){
    vm = this;
    var page = app.navi.getCurrentPage();
    vm.id = page.options.selectedid;    
    vm.isOffline = false;
    //vm.thumbnailURL = ConstantService.thumbnailURL;    
     try {
            if(!ons.platform.isAndroid() && !ons.platform.isIOS()){
              console.log('ons.platform.isWebView: ');   
              vm.thumbnailURL = ConstantService.thumbnailURL;
              vm.productImgURL = ConstantService.productImgURL;
            } 
            if(ons.platform.isAndroid()){
                console.log('ons.platform.isAndroid: ');                  
                //vm.thumbnailURL = cordova.file.dataDirectory;
                //vm.productImgURL = ConstantService.productImgURL;
                //vm.productImgURL = cordova.file.dataDirectory;
                vm.thumbnailURL = ConstantService.localImgURL;
                vm.productImgURL = ConstantService.localImgURL;
            } 
            if(ons.platform.isIOS()){
                console.log('ons.platform.isIOS: ');                                  
                //vm.thumbnailURL = cordova.file.documentsDirectory;
                //vm.productImgURL = ConstantService.productImgURL;
                //vm.productImgURL = cordova.file.documentsDirectory;
                vm.thumbnailURL = ConstantService.localImgURL;
                vm.productImgURL = ConstantService.localImgURL;
            }
        } 
        catch (e) {
            console.log('An error has occured '+e.message);            
        }
    
    vm.init = function($scope){
        console.log('wineItemDetailController init');
        vm.failed = false;        
        vm.isFetching = true;

        if (!ConstantService.appInit){        
        $http.get(ConstantService.wsURL + '/winesbyID.json?product_id='+vm.id)
            .success( function(response){              
                    if (response) {                        
                        var items = response.data;
                    }
                    //vm.feeds = data.jsonFlickrFeed;
                    vm.wines = items;
                    vm.isFetching = false;
                    vm.failed = false;
                    $localStorage.setObject('winesbyID_'+vm.id,items);
                    vm.isOffline = false;
                    console.log('get wines success');
                })
            .error(function(error){                    
                    vm.failed = true;                                   
                    vm.isFetching = false;       
                    vm.wines = $localStorage.getObject('winesbyID_'+vm.id);
                    vm.isOffline = true;
                    console.log('failed');
                });                
        } else {
            vm.isFetching = true;

            if (!ConstantService.winesByCat){
            $http.get(ConstantService.localImgURL + '/winesByCat.json')
            .success( function(response){              
                    if (response) {                        
                        var tmp = response.data;
                    }
                    //vm.feeds = data.jsonFlickrFeed;
                    ConstantService.winesByCat = JSON.stringify(tmp);
                   var tmpWines = tmp.wines.filter(function (row) {
                  if(row.product_id == vm.id) {
                    return true
                  } else {
                    return false;
                  }
                });                        
                //var tmpWines = $filter('filter')(tmp, { 'cat_id': vm.id });
                //console.log('tmpWines.length'+tmpWines.length);
                var tmpJSONString = '{"wines":'+ JSON.stringify(tmpWines) + '}'
                //vm.wines = tmpWines;
                vm.wines = JSON.parse(tmpJSONString);
                console.log('wineItemDetailController with localStorage');
                vm.isFetching = false;
                })
            .error(function(error){                    
                    vm.failed = true;                                   
                    vm.isFetching = false;       
                    vm.wines = $localStorage.getObject('winesbyID_'+vm.id);
                    vm.isOffline = true;
                    console.log('failed');
                });
            //console.log('vm.wines'+vm.wines.length);
            //console.log('vm.wines'+JSON.stringify(vm.wines));    
            } else {
                var tmp = JSON.parse(ConstantService.winesByCat);
                var tmpWines = tmp.wines.filter(function (row) {
                  if(row.product_id == vm.id) {
                    return true
                  } else {
                    return false;
                  }
                });
                var tmpJSONString = '{"wines":'+ JSON.stringify(tmpWines) + '}'
                //vm.wines = tmpWines;
                vm.wines = JSON.parse(tmpJSONString);
                console.log('wineItemDetailController with localStorage');
                vm.isFetching = false;
            }
        }        
        };
function filterByID(obj) {
  if (obj.cat_id == vm.id) {
    return true;
  } else {
    invalidEntries++;
    return false;
  }
}
vm.fetchPhotos = function($scope){
        vm.failed = false;        
        vm.isFetching = true;
    
        $http.get(ConstantService.wsURL + '/productscatmapbyID.json?cat_id='+vm.id)
            .success( function(response){              
                    if (response) {                        
                        var items = response.data;
                    }
                    vm.feeds = items;
                    vm.isFetching = false;
                    vm.failed = false;
                    console.log('get productscatmap success');
                })
            .error(function(error){                    
                    vm.failed = true;                                   
                    vm.isFetching = true;                       
                    console.log('failed');
                });
/*                
        $http.get('http://www.winehighclub.com/product_list/ws/wines.json')
            .success( function(response){              
                    if (response) {                        
                        var items = response.data;
                    }
                    //vm.feeds = data.jsonFlickrFeed;
                    vm.wines = items;
                    vm.isFetching = false;
                    vm.failed = false;
                    console.log('get wines success');
                })
            .error(function(error){                    
                    vm.failed = true;                                   
                    vm.isFetching = false;                       
                    console.log('failed');
                });                
*/                  
        };             
        vm.showDetail = function(url){
        console.log ('click');
        console.log ('selectedid' + id);
        //app.navitwo.pushPage("wineItems.html", { animation: "lift", selectedid: id });
        //app.slidingMenu.setMainPage('wineItems.html', {closeMenu: true})
        app.navi.pushPage("wineList-ItemDetailImage.html", { animation: "lift", selectedImage: url });
    };

        vm.showModal = function(url) {    
            vm.modal_msg = url;
            app.modal.show();
        };
        
        vm.hideModal = function() {
            app.modal.hide();
        };
        
        vm.openURL = function(product_id) {    
            var url = ConstantService.imgURL + product_id;
            var ref = window.open(url, '_blank', 'closebuttoncaption=Close,location=yes,enableViewportScale=yes,transitionstyle=coverhorizontal,toolbarposition=top,clearcache=no,clearsessioncache=no');    
            ref.addEventListener("exit", function () {
            ref.close();
        });    
            ref.show();
        }
    
});