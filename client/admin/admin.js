angular.module("crowdcart.admin", ["crowdcart.services"])

.controller("AdminController", function ($scope, $window, $location, Admin ) {

    $scope.data = {};
    $scope.dashboardData = {};
    $scope.showAllUsers = false;
    $scope.showAllLists = false;
    $scope.showDashboard = false;
    $scope.dashboardData.warningUsers = [];

    $scope.getAllUsers = function(){
      $scope.showDashboard = false;
      $scope.showAllLists = false;
      $scope.showAllUsers = true;
      Admin.getAllUsers().then(function(res){
        $scope.data.users = res;
      })
    }

    $scope.getAllLists = function(){
      $scope.showDashboard = false;
      $scope.showAllUsers = false;
      $scope.showAllLists = true;
      Admin.getAllLists().then(function(res){
        $scope.data.lists = res;
      })
    }


    $scope.displayAnalytics = function(){
      $scope.showAllUsers = false;
      $scope.showAllLists = false;
      $scope.showDashboard = true;

      Admin.getAllUsers().then(function(res){
        console.log(res);
        $scope.dashboardData.numberOfWarnings = 0;
        $scope.dashboardData.totalNumberOfUsers = res.length;

        for (var i = 0; i < res.length; i++){
          if (res[i].warning = true){
            $scope.dashboardData.numberOfWarnings++;
            $scope.dashboardData.warningUsers.push(res[i])
          }
        }
      })

      Admin.getAllLists().then(function(res){
        $scope.dashboardData.totalNumberOfLists = res.length;
      })
    }

    $scope.showWarnings = function(){
      console.log($scope.dashboardData.warningUsers);
      $scope.dashboardData.displayedWarningUsers = []
      for (var i = 0; i < $scope.dashboardData.warningUsers.length; i++){
        $scope.dashboardData.displayedWarningUsers.push($scope.dashboardData.warningUsers[i].username)
      }
    }


  });



