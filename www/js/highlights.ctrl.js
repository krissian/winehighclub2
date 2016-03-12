/*Controller: Second level wine category*/
angular.module('app').controller("highlightsController", function($scope, $http, $filter, ConstantService, $localStorage){
    vm = this;
    var page = app.navi.getCurrentPage();
    vm.sortType = 'product_name';
    vm.sortReverse = false;      
    vm.showFilter = false;
    vm.isOffline = false;
    vm.thumbnailURL = ConstantService.thumbnailURL;
    //vm.id = 80004;    
    //console.log('wine.id : ' + vm.id);
    
    if (!ConstantService.appInit){
            app.refreshData.modal.show();
        }
        
    if (vm.id == 80004){vm.desc = 'Highlights';}
    if (vm.id == 80003){vm.desc = 'New Arrivals';}
    if (vm.id == 80002){vm.desc = 'Special Offers';}
    if (vm.id == 80001){vm.desc = 'Daily Wine';}
    
    try {
        if(!ons.platform.isAndroid() && !ons.platform.isIOS()){
          console.log('ons.platform.isWebView: ');   
          vm.thumbnailURL = ConstantService.thumbnailURL;
        } 
        if(ons.platform.isAndroid()){
            console.log('ons.platform.isAndroid: ');                  
            //vm.thumbnailURL = cordova.file.dataDirectory;
                vm.thumbnailURL = ConstantService.localImgURL;
                vm.productImgURL = ConstantService.localImgURL;            
        } 
        if(ons.platform.isIOS()){
            console.log('ons.platform.isIOS: ');                                  
            //vm.thumbnailURL = cordova.file.documentsDirectory;
                vm.thumbnailURL = ConstantService.localImgURL;
                vm.productImgURL = ConstantService.localImgURL;
        }
    } 
    catch (e) {
        console.log('An error has occured '+e.message);            
    }
    
    vm.init = function($scope){
        if (vm.id == 80004){vm.desc = 'Highlights';}
        if (vm.id == 80003){vm.desc = 'New Arrivals';}
        if (vm.id == 80002){vm.desc = 'Special Offers';}
        if (vm.id == 80001){vm.desc = 'Daily Wine';}
        //vm.id = $scope.id;
        vm.failed = false;        
        vm.isFetching = true;

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
                    vm.desc += ' ('+ response.data.wines.length +')';
                    $localStorage.setObject('winesbyCatID_'+vm.id,items);
                    vm.isOffline = false;
                    console.log('get wines success');
                })
            .error(function(error){                    
                    vm.failed = true;                                   
                    vm.isFetching = false;                       
                    vm.wines = $localStorage.getObject('winesbyCatID_'+vm.id);
                    vm.desc += ' ('+ vm.wines.wines.length +')';
                    vm.isOffline = true;
                    console.log('failed');
                });    
        } else {
            vm.wines = $localStorage.getObject('winesbyCatID_'+vm.id);
            vm.desc += ' ('+ vm.wines.wines.length +')';
            vm.isFetching = false;
            console.log('highlightsController with localStorage');
        }
                  
        };            
    vm.refresh = function($scope){
        if (vm.id == 80004){vm.desc = 'Highlights';}
        if (vm.id == 80003){vm.desc = 'New Arrivals';}
        if (vm.id == 80002){vm.desc = 'Special Offers';}
        if (vm.id == 80001){vm.desc = 'Daily Wine';}
        //vm.id = $scope.id;
        vm.failed = false;        
        vm.isFetching = true;

        
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
                    vm.desc += ' ('+ response.data.wines.length +')';
                    $localStorage.setObject('winesbyCatID_'+vm.id,items);
                    vm.isOffline = false;
                    console.log('get wines success');
                })
            .error(function(error){                    
                    vm.failed = true;                                   
                    vm.isFetching = false;                       
                    vm.wines = $localStorage.getObject('winesbyCatID_'+vm.id);
                    vm.desc += ' ('+ vm.wines.wines.length +')';
                    vm.isOffline = true;
                    console.log('failed');
                });    
                  
        };      
        //var winelist = $filter('filter')(vm.feeds.productscatmap, {cat_id:vm.id})[0];
        //console.log ('filtered : ' + winelist.cat_desc);
        //vm.text = winelist.cat_desc;
    vm.showDetail = function(id){
        console.log ('click');
        console.log ('selectedid' + id);
        //app.navitwo.pushPage("wineItems.html", { animation: "lift", selectedid: id });
        //app.slidingMenu.setMainPage('wineItems.html', {closeMenu: true})
        app.navi.pushPage("wineList-ItemDetail.html", { animation: "slide", selectedid: id });
    };
    vm.goBack = function($scope){
        app.navi.popPage();
    };
    vm.showSearch = function(id){
        console.log ('click');
        console.log ('selectedid' + id);
        app.navi.pushPage("wineListSearch.html", { animation: "slide", selectedid: id });
        //app.navi.pushPage("wineItems.html", { animation: "lift", selectedid: id });
    };    
    
});