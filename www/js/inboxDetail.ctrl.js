/*Controller: Second level wine category*/
angular.module('app').controller("inboxDetailController", function($rootScope, $scope, $http, $filter, ConstantService, $cordovaFile, $localStorage){
    vm = this;
    var page = app.navi.getCurrentPage();
    vm.id = page.options.selectedid;    
    vm.isOffline = false;
    //vm.thumbnailURL = ConstantService.thumbnailURL;        
    function replacePreviousPage(url) {
      var pages = app.navi.getPages(),
          index = pages.length - 2;

      if (index < 0)
          return;

      app.navi.insertPage(index, url);
      pages.splice(index, 1);
    };
    
    vm.goPop = function($scope){
      ConstantService.test++;    
      //app.navi.popPage({'refresh': true});  
      //app.navi.resetToPage('inboxList2.html', {animation: "lift"});
      replacePreviousPage('inboxListReload.html');
      app.navi.popPage();
    };
    vm.init = function($scope){
        console.log('inboxDetailController init');
        vm.failed = false;        
        vm.isFetching = true;
        
        if (!ConstantService.appInit){        
        $http.get(ConstantService.wsURL + 'vcontentByID.json?id='+vm.id)
            .success( function(response){              
                    if (response) {                        
                        var items = response.data;
                    }
                    //vm.feeds = data.jsonFlickrFeed;
                    vm.wines = items;
                    vm.isFetching = false;
                    vm.failed = false;
                    $localStorage.setObject('inboxbyID_'+vm.id,items);
                    vm.isOffline = false;
                    console.log('get wines success');
                })
            .error(function(error){                    
                    vm.failed = true;                                   
                    vm.isFetching = false;       
                    vm.wines = $localStorage.getObject('inboxbyID_'+vm.id);
                    $localStorage.setObject('inboxRead_'+vm.id, vm.wines);
                    vm.isOffline = true;
                    console.log('failed');
                });                
        } else {
            vm.isFetching = true;
            
            var tmp = $localStorage.getObject('inbox');
            var tmpWines = tmp.content.filter(function (row) {
              if(row.id == vm.id) {
                return true
              } else {
                return false;
              }
            });
            var tmpJSONString = '{"content":'+ JSON.stringify(tmpWines) + '}'
            //vm.wines = tmpWines;
            vm.wines = JSON.parse(tmpJSONString);
            $localStorage.setObject('inboxRead_'+vm.id, vm.wines);
            console.log('inboxDetailController with localStorage');
            vm.isFetching = false;
            
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