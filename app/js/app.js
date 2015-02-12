  'use strict';

  var myApp = angular.module('myApp', [
    'ngRoute',
    'myAppControllers'
  ]);

  myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
                        templateUrl: 'partials/home.html', 
                        controller: 'HomeCtrl'
                       });
    $routeProvider.otherwise({redirectTo: '/'});
  }]); 


