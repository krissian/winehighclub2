/*Controller: Second level wine category*/
angular.module('app').controller("wineAllProductController", function($scope, $http, $filter, ConstantService, $localStorage){
    vm = this;
    vm.title = 'WineHighClub';
    var page = app.navi.getCurrentPage();
    //vm.id = page.options.selectedid;
    //vm.id = 99;
    vm.desc = page.options.selectedDesc
    vm.sortType = 'product_name';
    vm.sortReverse = false;        
    vm.showFilter = false;
    vm.isOffline = false;
    
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
        vm.failed = false;        
        vm.isFetching = true;
      
        if (!ConstantService.appInit){     
        $http({
            method: 'GET',
            url: ConstantService.wsURL+'/wines.json',
            cache: false
          }).success( function(response){              
                    if (response) {                        
                        var items = response.data;
                    }
                    //vm.feeds = data.jsonFlickrFeed;
                    vm.wines = items;
                    vm.isFetching = false;
                    vm.failed = false;
                    $localStorage.setObject('wines',items);
                    vm.isOffline = false;
                    console.log('get wines success');
                })
            .error(function(error){                    
                    vm.failed = true;                                   
                    vm.isFetching = false;                       
                    vm.wines = $localStorage.getObject('wines');
                    vm.isOffline = true;
                    console.log('failed');
                });                
        } else {
                    vm.failed = true;                                   
                    vm.isFetching = false;                       
                    vm.wines = $localStorage.getObject('wines');
                    vm.isOffline = false;
                    console.log('wineAllProductController with localStorage');      
        }                        
        };            
    vm.refresh = function($scope){
        vm.failed = false;        
        vm.isFetching = true;
      
        $http({
            method: 'GET',
            url: ConstantService.wsURL+'/wines.json',
            cache: false
          }).success( function(response){              
                    if (response) {                        
                        var items = response.data;
                    }
                    //vm.feeds = data.jsonFlickrFeed;
                    vm.wines = items;
                    vm.isFetching = false;
                    vm.failed = false;
                    $localStorage.setObject('wines',items);
                    vm.isOffline = false;
                    console.log('get wines success');
                })
            .error(function(error){                    
                    vm.failed = true;                                   
                    vm.isFetching = false;                       
                    vm.wines = $localStorage.getObject('wines');
                    vm.isOffline = true;
                    console.log('failed');
                });                                        
        };          
        vm.MyDelegate = {
          configureItemScope: function(index, itemScope) {
            itemScope.item = vm.wines.wines[index];
          },
          calculateItemHeight: function(index) {
            return 44;
          },
          countItems: function() {
            return vm.wines.wines.length;
          }
        };        
vm.fetchPhotos = function($scope){
        vm.failed = false;        
        vm.isFetching = true;
    
        $http.get(ConstantService.wsURL+'/productscatmapbyID.json?cat_id='+vm.id)
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
    vm.getTotal = function(){
    var total = 0;
    total = vm.wines.wines.length;
    return total;
    };
      vm.showSearch = function(id){
        console.log ('click');
        console.log ('selectedid' + id);
        app.navi.pushPage("wineListSearch.html", { animation: "slide", selectedid: id });
        //app.navi.pushPage("wineItems.html", { animation: "lift", selectedid: id });
    };  
});