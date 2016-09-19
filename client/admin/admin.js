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
      var data = [];
      var maxNumber = 1;

      Admin.getAllLists().then(function(res, err){
        for (var key in res){
          var newDate = new Date(Date.parse(res[key].created_at))
          graphData[newDate.getHours()] = graphData[newDate.getHours()]+1 || 1;
          if (graphData[newDate.getHours()] > maxNumber){
            maxNumber = graphData[newDate.getHours()];
          }
        }

        for (var i = 0; i < 24; i++){
          if (!graphData[i]){
            data.push({time:i + ":00", count:0})
          } else {
            data.push({time:i + ":00", count: graphData[i]})
          }
        }

        console.log(data);


        var svg = d3.select("svg"),
            margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

        var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
            y = d3.scaleLinear().rangeRound([height, 0]);

        var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // d3.tsv("/admin/data.tsv", function(d) {
        //   d.frequency = +d.frequency;
        //   return d;
        // }, function(error, data) {
        //   console.log(data);
        // if (error) throw error;

          x.domain(data.map(function(d) { return d.time; }));
          y.domain([0, d3.max(data, function(d) { return d.count; })]);

          g.append("g")
              .attr("class", "axis axis--x")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x))
              .append("text")
             .attr("x", 265 )
             .attr("y", 240 )
             .style("text-anchor", "middle")
             .text("Hour");

          g.append("g")
              .attr("class", "axis axis--y")
              .call(d3.axisLeft(y).ticks(maxNumber))
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", "0.71em")
              .attr("text-anchor", "end")
              .text("Frequency");

          g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.time); })
              .attr("y", function(d) { return y(d.count); })
              .attr("width", x.bandwidth())
              .attr("height", function(d) { return height - y(d.count); })


      })

    }

  });


// console.log(graphData)
// var margin = {top: 20, right: 20, bottom: 70, left: 40},
//     width = 600 - margin.left - margin.right,
//     height = 300 - margin.top - margin.bottom;

// var y = d3.scale.linear().range([height, 0]);
// var x = d3.scale.ordinal().range([0,23]);

// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom")
//     .ticks(24);

// var yAxis = d3.svg.axis()
//     .scale(y)
//     .orient("left")
//     .ticks(10);

// var svg = d3.select(".graph").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");

// for (var key2 in graphData){

//   x.domain([0,24])
//   y.domain([0, d3.max(graphData, function(d) { return graphData.d; })]);
//   svg.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis)
//     .selectAll("text")
//       .style("text-anchor", "end")
//       .attr("dx", "-.8em")
//       .attr("dy", "-.55em")
//       .attr("transform", "rotate(-90)" );

//   svg.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//     .append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 6)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       .text("Value ($)");

//   svg.selectAll("bar")
//       .data(graphData)
//     .enter().append("rect")
//       .style("fill", "steelblue")
//       .attr("x", function(d) { return x(d); })
//       .attr("width", x.rangeBand())
//       .attr("y", function(d) { return y(graphData.d); })
//       .attr("height", function(d) { return height - y(graphData.d); });
// }



