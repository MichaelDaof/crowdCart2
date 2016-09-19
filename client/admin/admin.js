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
        $scope.dashboardData.numberOfWarnings = 0;
        $scope.dashboardData.totalNumberOfUsers = res.length;

        for (var i = 0; i < res.length; i++){
          if (res[i].warning === true){
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
      $scope.dashboardData.displayedWarningUsers = []
      for (var i = 0; i < $scope.dashboardData.warningUsers.length; i++){
        $scope.dashboardData.displayedWarningUsers.push($scope.dashboardData.warningUsers[i].username)
      }
    }

    $scope.showGraph = function(){

      var graphData = {};

      Admin.getAllLists().then(function(res, err){
        for (var key in res){
          var newDate = new Date(Date.parse(res[key].created_at))
          graphData[newDate.getHours()] = graphData[newDate.getHours()]+1 || 1;
        }

        console.log(graphData)
        var margin = {top: 20, right: 20, bottom: 70, left: 40},
            width = 600 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var y = d3.scale.linear().range([height, 0]);
        var x = d3.scale.ordinal().range([0,23]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(24);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);

        var svg = d3.select(".graph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

        for (var key2 in graphData){
          x.domain([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])
          y.domain([0, d3.max(graphData, function(d) { return graphData.d; })]);
        }

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
          .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-90)" );

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Value ($)");

        svg.selectAll("bar")
            .data(data)
          .enter().append("rect")
            .style("fill", "steelblue")
            .attr("x", function(d) { return x(d); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(graphData.d); })
            .attr("height", function(d) { return height - y(graphData.d); });


      })

    }

  });



