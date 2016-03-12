angular.module('app').controller("loadingController", function($scope, $http, $filter, ConstantService, $localStorage){
    vm = this;
    
    if (!ConstantService.appInit){
            app.refreshData.modal.show();
        }
//    vm.init = function($scope){
//        ConstantService.appInit = false;
//        app.refreshData.modal.show();
//    };

});