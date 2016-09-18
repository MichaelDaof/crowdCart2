angular.module("crowdcart.jobs", [])

.controller("JobsController", function ($scope, Jobs, Lists, $window, $location) {

  $scope.data = {};

  $scope.userid = $window.localStorage.getItem('crowdcartuser');
  //get all the jobs user took
  //populate the myjobs view
  $scope.getJobs = function() {
    Jobs.getJobs($scope.userid)
      .then(function(jobs){
        var uncompletedJobs = jobs.filter(function (job){
          return job.status !== "completed"
        })
        console.log("Uncompleted JObs: ", uncompletedJobs, jobs)
        $scope.data.jobs = uncompletedJobs;
      })
      .catch(function(error){
        console.log('ERROR: ', error);
      })
   }

  //display job detail which uses list detail page
  $scope.displayJobDetail = function(listid) {
    // simple redirect
    console.log(listid)
    $location.path("/listdetail/" + listid)
  }

  //Delete a job from myjobs view,
  //refresh the page to reflect the change,
  //redirect to all lists page when there is no job left

  $scope.deleteJob = function(list) {
    // list.deliverer_id = '';
    list.status = "completed";
    Lists.updateList(list)
      .then(function () {
        //console.log('delete job redi', $scope.data.jobs.length);
        $scope.getJobs();
         if ($scope.data.jobs.length === 1) {
            $location.path('/alllists');
         }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // Initialize Get Jobs Once
  $scope.getJobs();

  });
