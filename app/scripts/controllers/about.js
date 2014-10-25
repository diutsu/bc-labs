'use strict';

/**
 * @ngdoc function
 * @name bcBootstrapApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bcBootstrapApp
 */
angular.module('bcBootstrapApp')
  .controller('AboutCtrl', ['$scope','$http', function ($scope,$http) {
  	$http({
        method: 'GET',
        url: '/public/matrices/blosum50.array',
    }).success(function(data){
        	$scope.matrix = data;
        })
    .error(function(data) {
        $scope.error = data;
    });



    $scope.acid = ['A','R','N','D','C','Q','E','G','H','I','L','K','M','F','P','S','T','W','Y','V'];
  }]);

