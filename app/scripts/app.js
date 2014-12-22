'use strict';
/**
 * @ngdoc overview
 * @name bcBootstrapApp
 * @description
 * # bcBootstrapApp
 *
 * Main module of the application.
 */
angular
  .module('bcBootstrapApp', [
    'ngRoute',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/BC/Lab02', {
        templateUrl: 'views/bc/lab02.html',
        controller: 'BcLabAlignCtrl'
      })
      .when('/BC/Lab05', {
        templateUrl: 'views/bc/lab05.html',
        controller: 'BcLabSeqCtrl'
      })
      .when('/BC/Lab08', {
        templateUrl: 'views/bc/lab08.html',
        controller: 'BcLabMolPhCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
