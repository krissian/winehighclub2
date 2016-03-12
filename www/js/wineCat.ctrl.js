angular.module('app').controller("AAMainController", function($scope, $http){
    var vm = this;
    vm.title = 'wineCats';
    vm.searchInput = '';

    vm.init = function($scope){
        vm.failed = false;        
        vm.isFetching = true;
    
        $http.get('http://www.winehighclub.com/product_list/ws/productscat.json')
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
                  
        };
    
    vm.fetchPhotos = function($scope){
        vm.failed = false;        
        vm.isFetching = true;

        $http.get('http://www.winehighclub.com/product_list/ws/productscat.json')
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
        app.navi.pushPage("wineCatItems.html", { animation: "lift", selectedid: id });
        //app.navi.pushPage("wineItems.html", { animation: "lift", selectedid: id });
    };
});