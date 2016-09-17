angular.module("crowdcart.admin", ["crowdcart.services"])

.controller("AdminController", function ($scope, $window, $location, Admin ) {

    $scope.data = {};

    $scope.getAllUsers = function(){
      $scope.data.users = Admin.getAllUsers();
    }

    $scope.getAllLists = function(){
      $scope.data.lists = Admin.getAllLists();
    }

    $scope.displayAnalytics = function(){
      console.log("displayAnalytics function called");
    }

  });



