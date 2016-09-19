angular.module('crowdcart.financial', [])

.controller('FinancialController', function ($scope, $window, CCAuth){

  $scope.processingCard = false;

  $scope.createStripeToken = function (){
    $scope.processingCard = true;
    CCAuth.getToken($scope.stripe)
  }

})
