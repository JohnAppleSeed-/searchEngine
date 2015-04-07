'use strict';
var myAppControllers = angular.module('myAppControllers', []);
myAppControllers.controller('HomeCtrl', ['$scope', '$http', 
  function($scope, $http) {
    var socket     = io.connect();
    $scope.doThing = doThing;
    $scope.noDat   = 'white';

    function doThing(keypress) {
     socket.emit('kp', keypress);
    }

    socket.on('results', function(resdata) {
      $scope.noDat     = 'white';
      $scope.results   = resdata.results.posts;
      $scope.resultNum = resdata.results.num;
      $scope.$apply();
    });

    socket.on('noresults', function(resdata) {
      $scope.noDat = 'red';
      $scope.$apply();
    });

}]);
