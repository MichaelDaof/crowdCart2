angular.module("crowdcart.admin", ["crowdcart.services"])

.controller("AdminController", function ($scope, $window, $location, Admin ) {

    $scope.data = {};

    $scope.getAllUsers = function(){
      console.log("getAllUsers function called");
      $scope.data.users = Admin.getAllUsers();
    }

    $scope.getAllLists = function(){
      console.log("getAllLists function called");
    }

    $scope.displayAnalytics = function(){
      console.log("displayAnalytics function called");
    }

  });



