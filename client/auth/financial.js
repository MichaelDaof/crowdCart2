angular.module('crowdcart.financial', [])

.controller('FinancialController', function ($scope, $window, CCAuth){

  $scope.createStripeToken = function (){
    CCAuth.getToken($scope.stripe)
  }

})
