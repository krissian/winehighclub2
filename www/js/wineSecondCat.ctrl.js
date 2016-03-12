/*Controller: Second level wine category*/
angular.module('app').controller("wineSecondCatController", function($scope, $http, $filter, ConstantService, $localStorage, $cordovaFile){
    vm = this;
    var page = app.navi.getCurrentPage();
    vm.id = page.options.selectedid;    
    vm.desc = page.options.selectedDesc;
    vm.sortType = 'product_name';
    vm.sortReverse = false;    
    vm.showFilter = false;
    vm.isOffline = false;
    //vm.thumbnailURL = ConstantService.thumbnailURL;
    
    try {
            if(!ons.platform.isAndroid() && !ons.platform.isIOS()){
              console.log('ons.platform.isWebView: ');   
              vm.thumbnailURL = ConstantService.thumbnailURL;
            } 
            if(ons.platform.isAndroid()){
                console.log('ons.platform.isAndroid: ');                  
                //vm.thumbnailURL = cordova.file.dataDirectory;
                vm.thumbnailURL = ConstantService.localImgURL;
            } 
            if(ons.platform.isIOS()){
                console.log('ons.platform.isIOS: ');                                  
                //vm.thumbnailURL = cordova.file.documentsDirectory;
                vm.thumbnailURL = ConstantService.localImgURL;
            }
        } 
        catch (e) {
            console.log('An error has occured '+e.message);            
        }
    
    vm.init = function($scope){
        vm.failed = false;        
        vm.isFetching = true;
        ConstantService.backCatID = vm.id;
        
        if (!ConstantService.appInit){
        $http({
            method: 'GET',
            url: ConstantService.wsURL + '/winesbyCatID.json?cat_id='+vm.id,
            cache: false
          }).success( function(response){              
                    if (response) {                        
                        var items = response.data;
                    }
                    //vm.feeds = data.jsonFlickrFeed;
                    vm.wines = items;
                    vm.isFetching = false;
                    vm.failed = false;
                    $localStorage.setObject('winesbyCatID_'+vm.id,items);
                    vm.isOffline = false;
                    console.log('get wines success');
                    //console.log('vm.wines'+JSON.stringify(vm.wines));
                })
            .error(function(error){                    
                    vm.failed = true;                                   
                    vm.isFetching = false;
                    vm.wines = $localStorage.getObject('winesbyCatID_'+vm.id);
                    vm.isOffline = true;
                    console.log('failed');
                });                
        } else {
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
            }
            //var tmp = JSON.parse(ConstantService.winesByCat);
            var tmpWines = tmp.wines.filter(function (row) {
                  if(row.cat_id == vm.id) {
                    return true
                  } else {
                    return false;
                  }
                });                        

            var tmpJSONString = '{"wines":'+ JSON.stringify(tmpWines) + '}'
            //vm.wines = tmpWines;
            vm.wines = JSON.parse(tmpJSONString);
            vm.isFetching = false;
            console.log('wineSecondCatController with localStorage');

        }
        };    

    vm.refresh = function($scope){
        vm.failed = false;        
        vm.isFetching = true;
        console.log('ConstantService.backCatID: '+ ConstantService.backCatID);
        vm.id = ConstantService.backCatID;                           
        $http({
            method: 'GET',
            url: ConstantService.wsURL + '/winesbyCatID.json?cat_id='+vm.id,
            cache: false
          }).success( function(response){              
                    if (response) {                        
                        var items = response.data;
                    }
                    //vm.feeds = data.jsonFlickrFeed;
                    vm.wines = items;
                    vm.isFetching = false;
                    vm.failed = false;
                    $localStorage.setObject('winesbyCatID_'+vm.id,items);
                    vm.isOffline = false;
                    console.log('get wines success');
                    //console.log('vm.wines'+JSON.stringify(vm.wines));
                })
            .error(function(error){                    
                    vm.failed = true;                                   
                    vm.isFetching = false;
                    
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
                    }
                    //var tmp = JSON.parse(ConstantService.winesByCat);
                    var tmpWines = tmp.wines.filter(function (row) {
                          if(row.cat_id == vm.id) {
                            return true
                          } else {
                            return false;
                          }
                        });                        
        
                    var tmpJSONString = '{"wines":'+ JSON.stringify(tmpWines) + '}'
                    //vm.wines = tmpWines;
                    vm.wines = JSON.parse(tmpJSONString);
                    vm.isFetching = false;
                    console.log('wineSecondCatController with localStorage');
                    
                    vm.isOffline = true;
                    console.log('failed');
                });                

        };  

vm.fetchPhotos = function($scope){
        vm.failed = false;        
        vm.isFetching = true;
    
        $http.get(ConstantService.wsURL+'+/productscatmapbyID.json?cat_id='+vm.id)
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
                    vm.isFetching = false;                       
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
        //var winelist = $filter('filter')(vm.feeds.productscatmap, {cat_id:vm.id})[0];
        //console.log ('filtered : ' + winelist.cat_desc);
        //vm.text = winelist.cat_desc;
        vm.showDetail = function(sid){
        console.log ('selectedid: ' + sid);
        ConstantService.backCatID = vm.id;
        //app.navitwo.pushPage("wineItems.html", { animation: "lift", selectedid: id });
        //app.slidingMenu.setMainPage('wineItems.html', {closeMenu: true})
        app.navi.pushPage("wineList-ItemDetail.html", { animation: "slide", selectedid: sid });
    };
    vm.goBack = function($scope){
        app.navi.popPage();
    };
    
});