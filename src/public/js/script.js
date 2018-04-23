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
    var request = $http.get("/airlineData");
    request.success(function(data) {
        $scope.airlineData = JSON.parse(data);
        // console.log(data)
    });
    request.error(function(data) {
        console.log('Error pulling airline data.');
    });
    // $scope.searchName = "";
    // $scope.showFamilyTable = false;
    // $scope.showNoFamilyMessage = true;
    // $scope.search = function (){
    //   // console.log('clicked');
    //   // console.log($scope.searchName);
    //   var req = {
    //    method: 'POST',
    //    url: '/familydata',
    //    data: { 'data' : $scope.searchName }
    //   }
    //   $http(req).then(function(res) {
    //     $scope.familydata = JSON.parse(res.data);
    //     if ($.isEmptyObject($scope.familydata)) {
    //       $scope.showNoFamilyMessage = true;
    //       $scope.showFamilyTable = false;
    //     } else {
    //       $scope.showNoFamilyMessage = false;
    //       $scope.showFamilyTable = true;
    //     }
    //     // console.log($scope.familydata);
    //   });
    // };

})

var authApp = angular.module('Auth', []) {

}