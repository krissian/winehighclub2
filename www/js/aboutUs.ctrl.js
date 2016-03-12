/*Controller: Second level wine category*/
angular.module('app').controller("aboutUsController", function($scope, $http, $filter, $timeout){
    vm = this;
    var page = app.navi.getCurrentPage();
    vm.id = page.options.selectedid;    
    
    vm.init = function($scope){
        vm.failed = false;        
        vm.isFetching = true;

                
        $http.get('http://www.winehighclub.com/product_list/ws/winesbyID.json?product_id='+vm.id)
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
                
        };            
        vm.showModal = function(url) {    
            vm.modal_msg = url;
            app.modal.show();
        };
        
        vm.hideModal = function() {
            app.modal.hide();
        };
        vm.callTel = function(tel) {
            window.location.href = 'tel:'+ tel;
        }
        vm.callMail = function(tel) {
            window.location.href = "mailto:sales@winehighclub.com?subject=From%20WHC%20Mobile%20App";
        }        
        vm.openURL = function(locationID) {    
            var url = 'http://www.winehighclub.com';
            if (locationID == 'FB') {//facebook
                url = 'https://www.facebook.com/WineHighClub/';
            }
            if (locationID == 'WWW') {//website
                url = 'http://www.winehighclub.com';
            }          
            if (locationID =='MAP') {//Map
                url = 'https://www.google.com/maps?q=Wine+High+Club&z=8'
            }
//            if (locationID ==4) {//email
//                url = 'mailto:sales@winehighclub.com?subject=From%20WHC%Mobile%20App'
//            }
//            if (locationID ==5) {//phone
//                url = 'tel:35202028'
//            }            
            var ref = window.open(url, '_blank', 'closebuttoncaption=Close,location=no,enableViewportScale=yes,transitionstyle=coverhorizontal,toolbarposition=top,clearcache=no,clearsessioncache=no');    
            ref.addEventListener("exit", function () {
            ref.close();
        });    
            ref.show();
        }
//        google.maps.event.addDomListener(window, 'load', initMap);
//        function initMap () {
//            var latlng = new google.maps.LatLng(-34.397, 150.644);
//            var myOptions = {
//                zoom: 8,
//                center: latlng,
//                mapTypeId: google.maps.MapTypeId.ROADMAP
//            };
//            var map = new google.maps.Map(document.getElementById("whc-map"), myOptions);
//        }
    
});