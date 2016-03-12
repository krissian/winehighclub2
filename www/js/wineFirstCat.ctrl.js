/*Controller: first level wine category*/
angular.module('app').controller("wineFirstCatController", function($scope, $http, ConstantService, $localStorage ){
    var vm = this;
    vm.title = 'WineHighClub';
    vm.searchInput = '';
    vm.sortType = 'cat_desc';
    vm.sortReverse = false;    
    vm.showFilter = false;
    vm.isOffline = false;
    
    vm.init = function($scope){
        vm.failed = false;        
        vm.isFetching = true;
        
        if (!ConstantService.appInit){

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
                    vm.isOffline = false;
                    console.log('wineFirstCatController success');
                    //console.log("data = " + JSON.stringify(vm.feeds.productscat));
                    //console.log("data = " + print(vm.feeds));
                })
            .error(function(error){                    
                    vm.failed = true;                                   
                    vm.isFetching = false;   
                    vm.feeds = $localStorage.getObject('productscat');
                    vm.isOffline = true;
                    console.log('wineFirstCatController failed');
                });
                
        } else {
            vm.feeds = $localStorage.getObject('productscat');
            vm.isFetching = false;
            console.log('wineFirstCatController with localStorage');
        }
                  
        };
    vm.refresh = function($scope){
        vm.failed = false;        
        vm.isFetching = true;

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
                    vm.isOffline = false;
                    console.log('wineFirstCatController success');
                    //console.log("data = " + JSON.stringify(vm.feeds.productscat));
                    //console.log("data = " + print(vm.feeds));
                })
            .error(function(error){                    
                    vm.failed = true;                                   
                    vm.isFetching = false;   
                    vm.feeds = $localStorage.getObject('productscat');
                    vm.isOffline = true;
                    console.log('wineFirstCatController failed');
                });

                  
        };   
    vm.fetchPhotos = function($scope){
        vm.failed = false;        
        vm.isFetching = true;

        $http.get(ConstantService.wsURL + '/productscat.json')
            .success( function(response){              
                    if (response) {                        
                        var items = response.data;
                    }
                    //vm.feeds = data.jsonFlickrFeed;
                    vm.feeds = items;
                    vm.isFetching = false;
                    vm.failed = false;
                    console.log('success');
                    //console.log("data = " + JSON.stringify(vm.feeds.productscat));
                    //console.log("data = " + print(vm.feeds));
                })
            .error(function(error){                    
                    vm.failed = true;                                   
                    vm.isFetching = false;                       
                    console.log('failed');
                });
        /*          
        var print = function(o){
            var str='';
        
            for(var p in o){
                if(typeof o[p] == 'string'){
                    str+= p + ': ' + o[p]+'; </br>';
                }else{
                    str+= p + ': { </br>' + print(o[p]) + '}';
                }
            }
        
            return str;
        }
        */       
        
        /*
        $.ajax({
                url: "http://api.flickr.com/services/feeds/photos_public.gne?format=json",
                dataType: "jsonp",
                jsonpCallback: 'jsonFlickrFeed',            
                success: function(feeds){
                    vm.$apply(function(){
                    vm.feeds = feeds;
                    vm.isFetching = false;
                    vm.failed = false;
                    });
                },
                error: function(error){
                    vm.$apply(function(){
                    vm.failed = true;                                   
                    vm.isFetching = false;    
                    });
                }
            });
        */
            
    };
    
    vm.showDetail = function(id){
        console.log ('click');
        console.log ('selectedid' + id);
        app.navi.pushPage("wineCatItems.html", { animation: "slide", selectedid: id });
        //app.navi.pushPage("wineItems.html", { animation: "lift", selectedid: id });
    };
    vm.showSearch = function(id){
        console.log ('click');
        console.log ('selectedid' + id);
        app.navi.pushPage("wineListSearch.html", { animation: "slide", selectedid: id });
        //app.navi.pushPage("wineItems.html", { animation: "lift", selectedid: id });
    };
    vm.getTotal = function(){
    var total = 0;
    for(var i = 0; i < vm.feeds.productscat.length; i++){
        var item = vm.feeds.productscat[i];
        total += (item.cat_count*1);
    }
    return total;
}
});