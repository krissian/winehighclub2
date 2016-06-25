/*Controller: Second level wine category*/
angular.module('app').controller("inboxListController", function($rootScope, $scope, $http, $filter, ConstantService, $localStorage){
    vm = this;
    var page = app.navi.getCurrentPage();
    
    vm.id = 70001;    
    //console.log('wine.id : ' + vm.id);
    //vm.desc = 'Inbox' + ConstantService.test;
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
                    //vm.desc += ' ('+ response.data.content.length +')';
                    vm.desc = 'Inbox' + ' ('+ countUnRead()+' / '+response.data.content.length +')';
                    $localStorage.setObject('inbox',items);
                    vm.isOffline = false;            
                    if(ons.platform.isIOS()){
                        //cordova.plugins.notification.badge.clear();    
                        var unReadCount = countUnRead();
                        ConstantService.inboxUnRead = unReadCount;
                        cordova.plugins.notification.badge.set(unReadCount);
                    }                    
                    console.log('get inbox success');
                })
            .error(function(error){                    
                    vm.failed = true;                                   
                    vm.isFetching = false; 
                    vm.feeds = $localStorage.getObject('inbox');
                    vm.desc = 'Inbox' + ' ('+ countUnRead()+' / '+response.data.content.length +')';
                    vm.isOffline = true;
                    if(ons.platform.isIOS()){
                        //cordova.plugins.notification.badge.clear();    
                        var unReadCount = countUnRead();
                        ConstantService.inboxUnRead = unReadCount;
                        cordova.plugins.notification.badge.set(unReadCount);
                    }
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
    
    function markAsRead(sid){
        //get items from sid
        var tmp = $localStorage.getObject('inbox');
        var tmp2 = $localStorage.getObject('inboxRead_'+sid);
        var tmpWines = tmp.content.filter(function (row) {
          if(row.id == sid) {
            return true
          } else {
            return false;
          }
        });
        var tmpJSONString = '{"content":'+ JSON.stringify(tmpWines) + '}'        
        var wines = JSON.parse(tmpJSONString);
        /*
        var tmp3 = {};
        if (tmp2.content) {
            tmp3 = tmp2;
        }
        */
        //angular.merge(tmp3, wines);
        //var tmp4 = {};
        //tmp4 = angular.merge({}, tmp3, wines);
        //angular.extend(tmp3, wines);
        if (!tmp2.content){
            //tmp3.content.push(wines.content[0]);            
            //tmp3 = wines;
            $localStorage.setObject('inboxRead_'+sid, wines);
        }            
    }
    function countUnRead(){
        //get items from sid
        var tmp = $localStorage.getObject('inbox');
        
        var count = 0;
        //console.log('tmp.content.length'+tmp.content.length);
        for(var i=0; i < tmp.content.length; i++){
            var tmp2 = $localStorage.getObject('inboxRead_'+tmp.content[i].id);    
            if (!tmp2.content){
            count++;
            }            
        }
        //console.log('countUnRead'+count);
        return count;
        
    }    
    vm.checkRead = function(sid){
        //console.log('checkRead called '+ sid);
        //true read
        //false unread
        var tmp2 = $localStorage.getObject('inboxRead_'+sid);
        if (!tmp2.content){
            return false;
        } else {
            return true;
        }
    }
    vm.showDetail = function(sid){
        console.log ('selectedid: ' + sid);
        ConstantService.backCatID = vm.id;
        markAsRead(sid);
        //app.navitwo.pushPage("wineItems.html", { animation: "lift", selectedid: id });
        //app.slidingMenu.setMainPage('wineItems.html', {closeMenu: true})        
        app.navi.pushPage("inboxList-ItemDetail.html", { animation: "slide", selectedid: sid });
    };
    
});