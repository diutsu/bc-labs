'use strict';

/**
 * 
 * www.cise.ufl.edu/research/sparse/matrices/Newman/karate.html@ngdoc function
 * @name bcBootstrapApp.controller:BcLabCtrl
 * @description
 * # BcLabCtrl
 * Controller of the bcBootstrapApp
 */
angular.module('bcBootstrapApp')
.controller('BcLabSeqCtrl', ['$scope','$http',function ($scope,$http) {

    $scope.acids = "ACGT";
    $scope.reset = function (){
        $scope.states = new Array($scope.numberStates);
        for(var i = 0; i < $scope.numberStates; i++){
            $scope.states[i] ="S"+i;
        };
    };
}]);
