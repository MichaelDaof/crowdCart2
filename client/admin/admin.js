angular.module("crowdcart.admin", ["crowdcart.services"])

.controller("AdminController", function ($scope, $window, $location, Admin ) {

    $scope.data = {};
    $scope.showAllUsers = false;
    $scope.showAllLists = false;
    $scope.showDashbaord = false;

    $scope.getAllUsers = function(){
      $scope.showDashbaord = false;
      $scope.showAllLists = false;
      $scope.showAllUsers = true;
      Admin.getAllUsers().then(function(res){
        $scope.data.users = res;
      })
    }

    $scope.getAllLists = function(){
      $scope.showDashbaord = false;
      $scope.showAllUsers = false;
      $scope.showAllLists = true;
      Admin.getAllLists().then(function(res){
        $scope.data.lists = res;
      })
    }

    $scope.displayAnalytics = function(){
      $scope.showAllUsers = false;
      $scope.showAllLists = false;
      $scope.showDashbaord = true;
      //get total number of users, set to $scope.data.totalUsers
      //get total number of lists, set to $scope.data.totalLists
      //get total number of warnings, set to $scope.data.totalWarnings
    }

  });



