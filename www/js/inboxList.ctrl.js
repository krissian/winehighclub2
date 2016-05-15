/*Controller: Second level wine category*/
angular.module('app').controller("inboxListController", function($scope, $http, $filter, ConstantService, $localStorage){
    vm = this;
    var page = app.navi.getCurrentPage();
    vm.id = 70001;    
    //console.log('wine.id : ' + vm.id);
    vm.desc = 'Inbox';
    vm.isOffline = false;
    vm.cmsURL = ConstantService.cmsURL;
    vm.init = function($scope){
        //vm.id = $scope.id;
        vm.failed = false;        
        vm.isFetching = true;

        $http.get(ConstantService.wsURL+'/vcontentBycatID.json?catid=104')
            .success( function(response){              
                    if (response) {                        
                        var items = response.data;
                    }
                    //vm.feeds = data.jsonFlickrFeed;
                    vm.feeds = items;
                    vm.isFetching = false;
                    vm.failed = false;          
                    $localStorage.setObject('inbox',items);
                    vm.isOffline = false;
                    console.log('get inbox success');
                })
            .error(function(error){                    
                    vm.failed = true;                                   
                    vm.isFetching = false; 
                    vm.feeds = $localStorage.getObject('inbox');
                    vm.isOffline = true;
                    console.log('failed');
                });                
                  
        };            
vm.fetchPhotos = function($scope){
        vm.failed = false;        
        vm.isFetching = true;
    
        $http.get(ConstantService.wsURL+'/vcontentBycatID.json?catid=104')
            .success( function(response){              
                    if (response) {                        
                        var items = response.data;
                    }
                    vm.feeds = items;
                    vm.isFetching = false;
                    vm.failed = false;
                    
                    console.log('get inbox success');
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
        app.navi.pushPage("wineList-ItemDetail.html", { animation: "fade", selectedid: id });
    };
    vm.goBack = function($scope){
        app.navi.popPage();
    };
    
    vm.openURL = function(url) {                
            var ref = window.open(url, '_blank', 'closebuttoncaption=Close,location=no,enableViewportScale=yes,transitionstyle=coverhorizontal,toolbarposition=top,clearcache=no,clearsessioncache=no');    
            ref.addEventListener("exit", function () {
            ref.close();
        });    
            ref.show();
        }
    vm.openModal = function(url) {
        vm.eventImgURL = url;
        app.newsevent.modal.show();
    }
    
    vm.showDetail = function(sid){
        console.log ('selectedid: ' + sid);
        ConstantService.backCatID = vm.id;
        //app.navitwo.pushPage("wineItems.html", { animation: "lift", selectedid: id });
        //app.slidingMenu.setMainPage('wineItems.html', {closeMenu: true})
        app.navi.pushPage("inboxList-ItemDetail.html", { animation: "slide", selectedid: sid });
    };
    
});