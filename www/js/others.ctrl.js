/*Controller: Second level wine category*/
angular.module('app').controller("othersController", function($scope, $http, $filter, ConstantService, $localStorage){
    vm = this;
    var page = app.navi.getCurrentPage();
    vm.sortType = 'product_name';
    vm.sortReverse = false;      
    vm.showFilter = false;
    vm.isOffline = false;
    //vm.thumbnailURL = ConstantService.thumbnailURL;
    //vm.id = 80004;    
    //console.log('wine.id : ' + vm.id);
//    ons.ready(function() {
//        app.navi.on('postpop', function(event) {
//        var page = event.leavePage; // Get current page object
//        console.log(page);
//        console.log('postpop ConstantService.backCatID: '+ ConstantService.backCatID);
//        if (ConstantService.backCatID == 80003){app.navi.resetToPage('highlights-N.html');}
//        //window.location.reload(true); //reload the whole app
//        //app.navi.resetToPage(page);
//        });
//    });
    if (!ConstantService.appInit){
            app.refreshData.modal.show();
        }
        
    if (vm.id == 81001){vm.desc = 'Mineral Water';vm.cat='mw';}
    if (vm.id == 81002){vm.desc = 'Craft Beer';vm.cat='br';}
    if (vm.id == 81003){vm.desc = 'Spirits';vm.cat='wk';}
    
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
        ConstantService.backCatID = vm.id;
        console.log('othersController init');
        if (vm.id == 81001){vm.desc = 'Mineral Water';vm.cat='mw';}
        if (vm.id == 81002){vm.desc = 'Craft Beer';vm.cat='br';}
        if (vm.id == 81003){vm.desc = 'Spirits';vm.cat='wk';}
        //vm.id = $scope.id;
        vm.failed = false;        
        vm.isFetching = true;

        if (!ConstantService.appInit){
        $http({
            method: 'GET',
            url: ConstantService.wsURL + '/otherprod.json?cat_type='+vm.cat,
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
                    $localStorage.setObject('otherprod_'+vm.cat,items);
                    vm.isOffline = false;
                    console.log('get wines success');
                })
            .error(function(error){                    
                    vm.failed = true;                                   
                    vm.isFetching = false;                       
                    vm.wines = $localStorage.getObject('otherprod_'+vm.cat);
                    vm.desc += ' ('+ vm.wines.wines.length +')';
                    vm.isOffline = true;
                    console.log('failed');
                });    
        } else {
            vm.wines = $localStorage.getObject('otherprod_'+vm.cat);
            vm.desc += ' ('+ vm.wines.wines.length +')';
            vm.isFetching = false;
            console.log('othersController with localStorage');
        }       
        };            
    vm.refresh = function($scope){
        console.log('othersController refresh');
        console.log('ConstantService.backCatID: '+ ConstantService.backCatID);
        vm.id = ConstantService.backCatID;
        
        if (vm.id == 81001){vm.desc = 'Mineral Water';vm.cat='mw';}
        if (vm.id == 81002){vm.desc = 'Craft Beer';vm.cat='br';}
        if (vm.id == 81003){vm.desc = 'Spirits';vm.cat='wk';}
        
        vm.failed = false;        
        vm.isFetching = true;
        vm.wines = '';
        
        $http({
            method: 'GET',
            url: ConstantService.wsURL + '/otherprod.json?cat_type='+vm.cat,
            cache: false
          }).success( function(response){              
                    if (response) {                        
                        var items = response.data;
                    }
                    //vm.feeds = data.jsonFlickrFeed;
                    vm.wines = items;
                    
                    vm.desc += ' ('+ response.data.wines.length +')';
                    $localStorage.setObject('otherprod_'+vm.cat,items);
                    vm.isFetching = false;
                    vm.failed = false;
                    vm.isOffline = false;
                    console.log('get wines success');
                })
            .error(function(error){                    
                                          
                    vm.wines = $localStorage.getObject('otherprod_'+vm.cat);
                    vm.desc += ' ('+ vm.wines.wines.length +')';
                    vm.failed = true;                                   
                    vm.isFetching = false; 
                    vm.isOffline = true;
                    console.log('failed');
                });    
                  
        };      
        //var winelist = $filter('filter')(vm.feeds.productscatmap, {cat_id:vm.id})[0];
        //console.log ('filtered : ' + winelist.cat_desc);
        //vm.text = winelist.cat_desc;
    vm.showDetail = function(sid){
        console.log ('selectedid: ' + sid);
        ConstantService.backCatID = vm.id;
        //app.navitwo.pushPage("wineItems.html", { animation: "lift", selectedid: id });
        //app.slidingMenu.setMainPage('wineItems.html', {closeMenu: true})
        app.navi.pushPage("otherprod-ItemDetail.html", { animation: "slide", selectedid: sid });
    };
    vm.goBack = function($scope){
        app.navi.popPage();
    };
    vm.showSearch = function(sid){
        console.log ('selectedid: ' + sid);
        
        app.navi.pushPage("wineListSearch.html", { animation: "slide", selectedid: sid });
        //app.navi.pushPage("wineItems.html", { animation: "lift", selectedid: id });
    };    
    
});