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
.controller('BcLabMolPhCtrl', ['$scope','$http',function ($scope,$http) {
  $scope.acid = ['A','T','G','C'];
  $scope.randomSize = 10;
  $scope.populationSize = 5;
  $scope.randomSeq = function(){
    var rndSeq = "";
    for(var i = 0; i < $scope.randomSize; i++){
      rndSeq = rndSeq.concat($scope.acid[ Math.floor(Math.random()*($scope.acid.length-1))])
    }
    $scope.fasta = "";
    for(var i = 0; i < $scope.populationSize; i++){
     $scope.fasta = $scope.fasta.concat(">sequence_").concat(i).concat("\n").concat(rndSeq).concat("\n\n");

    }
  }

  $scope.evolve = function(){
    var fastaArray = $scope.fasta.split("\n");
    $scope.fastaArray = fastaArray;
    $scope.names = new Array($scope.populationSize-1);
    $scope.sequences = new Array($scope.populationSize-1);
    $scope.sets = new Array($scope.populationSize-1);
    for(var i = 0; i< fastaArray.length; i++){
      if(i%3 == 0){
        $scope.names[Math.floor(i/3)] = fastaArray[i];
      }
      if(i%3 == 1){
        $scope.sequences[Math.floor(i/3)] = fastaArray[i];
      }
    }
  }
}]);

