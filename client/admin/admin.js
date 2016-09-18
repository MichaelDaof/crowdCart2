angular.module("crowdcart.admin", ["crowdcart.services"])

.controller("AdminController", function ($scope, $window, $location, Admin ) {

    $scope.data = {};
    $scope.showAllUsers = false;
    $scope.showAllLists = false;

    $scope.getAllUsers = function(){
      $scope.showAllLists = false;
      $scope.showAllUsers = true;
      Admin.getAllUsers().then(function(res){
        $scope.data.users = res;
      })
    }

    $scope.getAllLists = function(){
    $scope.showAllUsers = false;
    $scope.showAllLists = true;
      Admin.getAllLists().then(function(res){
        $scope.data.lists = res;
        console.log(res)
      })
    }

    $scope.displayAnalytics = function(){
      console.log("displayAnalytics function called");
    }

  });



