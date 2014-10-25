'use strict';
$('[data-toggle="tooltip"]').tooltip({'placement': 'bottom'});
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
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
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
        controller: 'BcLabCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
