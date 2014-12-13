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
      .when('/BC/Lab01', {
        templateUrl: 'views/bc/lab01.html',
        controller: 'BcLabAlignCtrl'
      })
      .when('/BC/Lab02', {
        templateUrl: 'views/bc/lab02.html',
        controller: 'BcLabSeqCtrl'
      })
      .when('/BC/Lab03', {
        templateUrl: 'views/bc/lab03.html',
        controller: 'BcLabMolPhCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
