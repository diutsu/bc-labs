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
  $scope.rr = .4;
  $scope.mr = .3;
  $scope.rfl = 4;
  $scope.generationsNumber = 4;



  $scope.randomSeq = function(){
    var rndSeq = "";
    for(var i = 0; i < $scope.randomSize; i++){
      rndSeq = rndSeq.concat($scope.acid[ Math.floor(Math.random()*($scope.acid.length))])
    }
    $scope.fasta = "";
    for(var i = 0; i < $scope.populationSize; i++){
     $scope.fasta = $scope.fasta.concat(">sequence_").concat(i).concat("\n").concat(rndSeq).concat("\n\n");

    }
  }

  $scope.evolve = function(){
            $scope.initTime = Date.now();

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
   var logtxt =""
   var sequences = $scope.sequences;
    for(var gen = 0; gen < $scope.generationsNumber; gen++){
        //mutate
        for(var i = 0; i < sequences.length; i++){
          if (Math.random() <= $scope.mr){
            var pos = Math.floor(Math.random()*$scope.randomSize);

            var oldValPos =  0
            for(var j=0; j< $scope.acid.length; j++){
              if(sequences[i][pos]== $scope.acid[j]){
                oldValPos = j;
                break;
              }
            }

            var newVal = Math.floor(Math.random()*($scope.acid.length-1));
            if (newVal >= oldValPos){
              newVal++;
            }


            var replacement = $scope.acid[newVal];
            sequences[i] =  sequences[i].substr(0, pos) + replacement +  sequences[i].substr(pos+replacement.length);

       //     logtxt = logtxt.concat("On generation").concat(gen).concat(", ").concat($scope.names[i]).concat(' position ').concat(pos).concat(' mutated ').concat($scope.acid[oldValPos]).concat(' to ').concat($scope.acid[newVal]).concat("\n");
          }
        }

         //recombinate
        for(var i = 0; i < sequences.length; i++){
          console.log($scope.rr);
          if (Math.random() <= $scope.rr){
            var pos = Math.floor(Math.random()*($scope.randomSize-$scope.rfl));

            var srcSeq = Math.floor(Math.random()*(sequences.length-1));
            if (srcSeq >= i){
              srcSeq++;
            }

            var replacement = sequences[srcSeq].substr(pos, pos+$scope.rfl);
            sequences[i] =  sequences[i].substr(0, pos) + replacement +  sequences[i].substr(pos+replacement.length);

   //        logtxt = logtxt.concat("On generation").concat(gen).concat(", ").concat($scope.names[i]).concat(' position ').concat(pos).concat(' recombinated ').concat($scope.acid[oldValPos]).concat(' with ').concat($scope.names[srcSeq]).concat(", ").concat(sequences[srcSeq]).concat("\n");
          }

        }
    //    logtxt = logtxt.concat(sequences).concat("\n");
    }
    $scope.logtxt = logtxt;
        $scope.sequences = sequences;
        $scope.totalTime = Date.now() - $scope.initTime;

  }
}]);

