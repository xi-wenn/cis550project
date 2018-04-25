var app = angular.module('NYCBikes', []);
app.controller('bikeController', function($scope, $http) {
    var request = $http.get("https://feeds.citibikenyc.com/stations/stations.json");
    request.success(function(data) {
        $scope.data = data.stationBeanList;
    });
    request.error(function(data) {
        console.log('err');
    });
});

var flightApp = angular.module('Flights', []);
flightApp.controller('flightsController', function($scope, $http) {
    console.log("js loaded");
    // var request = $http.get("/airlineData");
    // request.success(function(data) {
    //     $scope.airlineData = JSON.parse(data);
    //     // console.log(data)
    // });
    // request.error(function(data){
    //     console.log('Error pulling airline data.');
    // });



  // $scope.searchName = "";
  // $scope.showFamilyTable = false;
  // $scope.showNoFamilyMessage = true;
  $scope.search = function (){
    console.log('clicked');
    console.log($scope.searchData);

    $scope.performanceData = null;
    $scope.avgArrDelayData = null;
    $scope.avgDepDelayData = null;
    $scope.incidentData = null;

    var searchType = $scope.searchData.type;
    var data = Object.assign({}, $scope.searchData);
    delete data.type;

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            // console.log(key + ":" + queryParams[key]);
            if (data[key].length == 0) {
              delete data[key];
              // queryStr += keyColumnMapping[key] + ' = "' + queryParams[key] + '" ';
            }
        }
    }


    if ($.isEmptyObject(data)) {
      $scope.errorMsg = "Must add at least one filter!";
      $scope.showError = true;
      return;
    } else if (!searchType) {
      $scope.errorMsg = "Must select search type!";
      $scope.showError = true;
    } else {
      $scope.errorMsg = "";
      $scope.showLoading = true;
      $scope.showError = false;
    }
    var typeUrlMap = {
      'performance': '/performanceData',
      'avgArrDelay': '/avgArrDelayData',
      'avgDepDelay': '/avgDepDelayData',
      'incident': '/incidentData'
    }
    var req = {
     method: 'POST',
     url: typeUrlMap[searchType],
     data: data
    }
    console.log(req);
    $http(req).then(function(res) {
      $scope[searchType + 'Data'] = JSON.parse(res.data);
      $scope.showLoading = false;
      console.log($scope);
    });
  };
});


var airlineApp = angular.module('Airlines', []);
airlineApp.controller('airlineController', function($scope, $http) {
    console.log("js loaded");
    var request = $http.get("/airlineData");
    request.success(function(data) {
        $scope.airlineData = JSON.parse(data);
        console.log(data)
    });
    request.error(function(data) {
        console.log('Error pulling airline data.');
    });
});


var airportApp = angular.module('Airports', []);
airportApp.controller('airportController', function($scope, $http) {
    console.log("js loaded");
    var request = $http.get("/airportData");
    request.success(function(data) {
        $scope.airportData = JSON.parse(data);
        console.log(data)
    });
});
