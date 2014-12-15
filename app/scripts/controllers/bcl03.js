'use strict';

/**
 *
 * @ngdoc function
 * @name bcBootstrapApp.controller:BcLabCtrl
 * @description
 * # BcLabCtrl
 * Controller of the bcBootstrapApp
 */
angular.module('bcBootstrapApp')
.controller('BcLabMolPhCtrl', ['$scope','$http',function ($scope,$http) {
  $scope.acid = ['A','T','G','C'];
  $scope.randomSize = 100;
  $scope.populationSize = 100;
  $scope.rr = .01;
  $scope.mr = .01;
  $scope.rfl = 5;
  $scope.generationsNumber = 5000;



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
    $scope.hammingDist = new Array($scope.populationSize-1);
    $scope.jukes = new Array($scope.populationSize-1);

    for(var i = 0; i< fastaArray.length; i++){
      if(i%3 == 0){
        $scope.names[Math.floor(i/3)] = fastaArray[i];
      }
      if(i%3 == 1){

        $scope.sequences[Math.floor(i/3)] = new Array($scope.randomSize);
        for(var j = 0; j< $scope.randomSize;j++){
          $scope.sequences[Math.floor(i/3)][j] = fastaArray[i][j];
        }
      }
    }
    // var logtxt =""
     var sequences = $scope.sequences;
      for(var gen = 0; gen < $scope.generationsNumber; gen++){
        //mutate
        for(var i = 0; i < sequences.length; i++){
          if (Math.random() <= $scope.mr){
            var pos = Math.floor(Math.random()*$scope.randomSize);

            var oldValPos =  0
            for(var j=0; j< $scope.acid.length; j++){
              if(sequences[i][pos] == $scope.acid[j]){
                oldValPos = j;
                break;
              }
            }

            var newVal = Math.floor(Math.random()*($scope.acid.length-1));
            if (newVal >= oldValPos){
              newVal++;
            }

            sequences[i][pos] =  $scope.acid[newVal];

       //     logtxt = logtxt.concat("On generation ").concat(gen).concat(", ").concat($scope.names[i]).concat(' position ').concat(pos).concat(' mutated ').concat($scope.acid[oldValPos]).concat(' to ').concat($scope.acid[newVal]).concat("\n");
          }
        }

         //recombinate
        for(var i = 0; i < sequences.length; i++){
          if (Math.random() <= $scope.rr){
            var pos = Math.floor(Math.random()*($scope.randomSize-$scope.rfl));

            var srcSeq = Math.floor(Math.random()*(sequences.length-1));
            if (srcSeq >= i){
              srcSeq++;
            }

            for(var j = 0; j< $scope.rfl;j++){
              sequences[i][pos+j] =  sequences[srcSeq][pos+j];
            }

        //   logtxt = logtxt.concat("On generation ").concat(gen).concat(", ").concat($scope.names[i]).concat(' position ').concat(pos).concat(' recombinated ').concat($scope.acid[oldValPos]).concat(' with ').concat($scope.names[srcSeq]).concat(", ").concat(sequences[srcSeq]).concat("\n");
          }

        }

        //distances
        $scope.hammingDist[gen] = 0;
        $scope.jukes[gen]=0;
        var jukesResults = 0
        for(var i = 0; i<sequences.length;i++){
          for(var j=i;j<sequences.length;j++){
            var diff=0;
            for(var n=0;n<$scope.randomSize;n++){
              if(sequences[i][n] != sequences[j][n]){
                diff++;
              }
            }
            $scope.hammingDist[gen]+=diff;

            var p = diff/$scope.randomSize;
            if(p<0.75){
              $scope.jukes[gen] =$scope.jukes[gen]+ -3 * Math.log(1-4*p/3)/4;
              jukesResults++;
            }
          }
        }
        $scope.hammingDist[gen] = $scope.hammingDist[gen]/(sequences.length*(sequences.length-1)/2);
        $scope.jukes[gen] = $scope.jukes[gen]/jukesResults;
      //    logtxt = logtxt.concat(sequences).concat("\n");
      }
     // $scope.logtxt = logtxt;

        $scope.sequences = sequences;
        $scope.totalTime = Date.now() - $scope.initTime;

  }
}]);

