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
        console.log('wineSecondCatController init');
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
            var tmp1 = $localStorage.getObject('wines');
            var tmpItems = tmp1.wines;
            var tmp = $localStorage.getObject('productscatmap');
            //filter Cat from Mapping
            var tmpCatItems = tmp.productscatmap.filter(function (row){
                if(row.cat_id == vm.id){
                    return true;
                } else {
                    return false;
                }
            });
            //filter items
            var tmpWines = [];
            angular.forEach(tmpCatItems, function (cat, catIndex) {
                var catObject = {};
                var l_product_id = cat.product_id;
                
                angular.forEach(tmpItems, function (item, itemIndex){
                    if (l_product_id == item.product_id){
                        tmpWines.push(item);
                        //console.log(item.product_id);
                    }
                });
            });
            var tmpJSONString = '{"wines":'+ JSON.stringify(tmpWines) + '}'
            //console.log(tmpJSONString);
            vm.wines = JSON.parse(tmpJSONString);
            vm.isFetching = false;
            console.log('wineSecondCatController with localStorage');

        }
        };    

    vm.refresh = function($scope){
        console.log('wineSecondCatController refresh');
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
                    
                    var tmp1 = $localStorage.getObject('wines');
                    var tmpItems = tmp1.wines;
                    var tmp = $localStorage.getObject('productscatmap');
                    //filter Cat from Mapping
                    var tmpCatItems = tmp.productscatmap.filter(function (row){
                        if(row.cat_id == vm.id){
                            return true;
                        } else {
                            return false;
                        }
                    });
                    //filter items
                    var tmpWines = [];
                    angular.forEach(tmpCatItems, function (cat, catIndex) {
                        var catObject = {};
                        var l_product_id = cat.product_id;
                        
                        angular.forEach(tmpItems, function (item, itemIndex){
                            if (l_product_id == item.product_id){
                                tmpWines.push(item);
                                //console.log(item.product_id);
                            }
                        });
                    });
                    var tmpJSONString = '{"wines":'+ JSON.stringify(tmpWines) + '}'
                    //console.log(tmpJSONString);
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