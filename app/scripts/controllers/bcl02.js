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

  $scope.acids = ['A','C','G','T'];
  $scope.numberStates = 2;
  $scope.reset = function (){
    $scope.states = new Array($scope.numberStates);
    $scope.start = {};
    $scope.transition = {};
    for(var i = 0; i < $scope.numberStates; i++){
      $scope.states[i] ="S"+i;
      $scope.start[$scope.states[i]] = 1/$scope.numberStates;
      $scope.transition[$scope.states[i]] = {};
    };
    for(var i = 0; i < $scope.numberStates; i++){
      $scope.states[i] ="S"+i;
      for(var j = 0 ; j < $scope.numberStates; j++){
        $scope.transition[$scope.states[i]][$scope.states[j]] = 0.5;
      }
    };
    $scope.emission = {};
    for(var i = 0; i < $scope.acids.length; i++){
      $scope.emission[$scope.acids[i]] = {};
      for(var j = 0; j < $scope.states.length; j++){
        $scope.emission[$scope.acids[i]][$scope.states[j]] = .2;
      }
    }
  };

  $scope.computeHMM = function(){
    if($scope.sequence.length > 0){
      $scope.modelMx = new Array( $scope.sequence.length);
      for(var i = 0; i  < $scope.sequence.length; i++){
        $scope.modelMx[i] = new Array($scope.states.length);
        for(var j = 0; j  < $scope.states.length; j++){
          $scope.modelMx[i][j] = {};
        }
      }
      // first iteration is a bit diferent  
      for(var j = 0; j < $scope.states.length; j++){
          $scope.modelMx[0][j].value = $scope.emission[$scope.sequence[0]][$scope.states[j]]*$scope.start[$scope.states[j]];
          $scope.modelMx[0][j].sum = $scope.modelMx[0][j].value;
          $scope.modelMx[0][j].path = $scope.states[j];
      }

      for(var i = 1; i < $scope.sequence.length; i++){
        for(var j = 0; j < $scope.states.length; j++){
          var bestPath = "";
          var transitionValue = 0
            $scope.modelMx[i][j].sum = 0;
          for(var k = 0; k < $scope.states.length; k++) {
            var tmp = $scope.modelMx[i-1][k].value*$scope.emission[$scope.sequence[i]][$scope.states[j]]*$scope.transition[$scope.states[k]][$scope.states[j]];
            $scope.modelMx[i][j].sum = $scope.modelMx[i][j].sum + $scope.modelMx[i-1][k].sum*$scope.emission[$scope.sequence[i]][$scope.states[j]]*$scope.transition[$scope.states[k]][$scope.states[j]];
            if (tmp > transitionValue) {
              transitionValue = tmp;
              bestPath = $scope.states[k];
            }
          }
          $scope.modelMx[i][j].value = transitionValue;
          $scope.modelMx[i][j].path = bestPath;
        }
      }
    }

    $scope.forwardProb = 0;
    for(var i = 0;i < $scope.states.length; i++){
      $scope.forwardProb = $scope.forwardProb + $scope.modelMx[$scope.sequence.length-1][i].sum;
    }
    $scope.resultStates ="";
    for(var j = $scope.sequence.length-1; j>= 0; j--){
      var max = 0;
      var state = "";
      for(var i = 0;i < $scope.states.length; i++){
        if($scope.modelMx[j][i].value > max){
          max= $scope.modelMx[j][i].value;
          state = $scope.modelMx[j][i].path;
        }
      }
      $scope.resultStates = state.concat(' - ').concat($scope.resultStates);
    }
  }
  $scope.reset();
}]);
