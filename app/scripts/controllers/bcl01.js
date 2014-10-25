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
.controller('BcLabCtrl', ['$scope','$http',function ($scope,$http) {

  $scope.availableScoringMx = ['match-missmatch','blosum50','pam250'];
  $scope.currentScoringMx = $scope.availableScoringMx[0];

  $scope.acid = ['A','R','N','D','C','Q','G','E','H','I','L','K','M','F','P','S','T','W','Y','V'];

  $scope.randomSeq = function(seq){
    var rndSeq = "";
    for(var i = 0; i < $scope.randomSize; i++){
      rndSeq = rndSeq.concat($scope.acid[ Math.floor(Math.random()*($scope.acid.length-1))])
    }
    if(seq == 1){
      $scope.seq1 = rndSeq;
    } else {
      $scope.seq2 = rndSeq;
    }
  }

  $scope.updateMatrix = function(){
    if($scope.currentScoringMx != 'match-missmatch'){
      delete $scope.matchMissmatch;
      $http({
        method: 'GET',
        url: 'public/matrices/'+$scope.currentScoringMx+'.json',
      }).success(function(data){
        $scope.matrix = data;
      })
      .error(function(data) {
        $scope.error = data;
      });
    } else {
      $scope.matrix = {}
      $scope.matchMissmatch = true;
      for(var i = 0; i<$scope.acid.length; i++){
        $scope.matrix[$scope.acid[i]] = {}
        for(var j = 0; j<$scope.acid.length; j++){
          $scope.matrix[$scope.acid[i]][$scope.acid[j]] = $scope.missmatchScore;
          if(i==j){
            $scope.matrix[$scope.acid[i]][$scope.acid[j]] = $scope.matchScore;
          }
        }
      }

    }
  };

  $scope.computeAlign = function(){
    if($scope.seq1 && $scope.seq2 && !isNaN($scope.gapPenalty)){
      $scope.results= [];
      $scope.dspMx= false;
        $scope.initTime = Date.now();

        var alignMx = new Array($scope.seq1.length);

        for(var i = 0; i < $scope.seq1.length+1; i++){
          alignMx[i] = new Array($scope.seq2.length);
          for(var j = 0; j < $scope.seq2.length+1;j++){
            alignMx[i][j] = {};
          }
        }

        alignMx[0][0].best=0;
        for(var i = 1; i < $scope.seq1.length+1; i++){
          alignMx[i][0].horiz = alignMx[i-1][0].best + $scope.gapPenalty;
          alignMx[i][0].best = alignMx[i-1][0].best + $scope.gapPenalty;
        }
        for(var i = 1; i < $scope.seq2.length+1; i++) {
          alignMx[0][i].vert = alignMx[0][i-1].best + $scope.gapPenalty;
          alignMx[0][i].best = alignMx[0][i-1].best + $scope.gapPenalty;
        }
        for(var i = 1; i < $scope.seq1.length+1; i++){
          for(var j = 1; j < $scope.seq2.length+1; j++) {
            var horiz = alignMx[i-1][j].best + $scope.gapPenalty;
            var vert = alignMx[i][j-1].best + $scope.gapPenalty;
            var diag = alignMx[i-1][j-1].best +
                $scope.matrix[$scope.seq1[i-1]][$scope.seq2[j-1]];

            alignMx[i][j].best = Math.max(diag,Math.max(vert,horiz));
            alignMx[i][j].diag = diag == alignMx[i][j].best;
            alignMx[i][j].vert = vert == alignMx[i][j].best;
            alignMx[i][j].horiz = horiz == alignMx[i][j].best;

          }
        }

        $scope.midTime = Date.now() - $scope.initTime;
        $scope.glbAlign = alignMx;
        $scope.traceback();
        $scope.totalTime = Date.now() - $scope.initTime;
        $scope.seqDsp1 = "-".concat($scope.seq1);
        $scope.seqDsp2 = "-".concat($scope.seq2);
        //$scope.computeLclAlign();
        //$scope.dspMx = $scope.seqDsp1.length < 15 && $scope.seqDsp2.length < 15;
    }
  };



  $scope.traceback = function(i,j,result){
    if(typeof(result)==='undefined'){
      result ={};
      result.res1 = "";
      result.res2 = "";
      i = $scope.seq1.length;
      j = $scope.seq2.length;
    }
    while(i > 0  || j > 0){
      if($scope.glbAlign[i][j].diag) {
        result.res1  = $scope.seq1[i-1].concat(result.res1 );
        result.res2 = $scope.seq2[j-1].concat(result.res2);
        if($scope.glbAlign[i][j].horiz){
          $scope.traceback(i-1,j,{
           res1: $scope.seq1[i-1].concat(result.res1 ),
           res2: "-".concat(result.res2)
          });
        }
        if($scope.glbAlign[i][j].vert){
          $scope.traceback(i,j-1,{
            res1: "-".concat(result.res1 ),
            res2: $scope.seq2[j-1].concat(result.res2)
          });
        }
        i--;
        j--;
      } else if($scope.glbAlign[i][j].horiz) {
          result.res1  = $scope.seq1[i-1].concat(result.res1 );
          result.res2 = "-".concat(result.res2);
          if($scope.glbAlign[i][j].vert) {
            $scope.traceback(i,j-1,{
              res1: "-".concat(result.res1 ),
              res2: $scope.seq2[j-1].concat(result.res2)
            });
          } 
          i--;
      } else if($scope.glbAlign[i][j].vert) {
          result.res1  = "-".concat(result.res1 );
          result.res2 = $scope.seq2[j-1].concat(result.res2);
          j--;
        }
    }
    $scope.results.push(result);
  };




/*  $scope.computeLclAlign = function(){
    if($scope.seq1 && $scope.seq2 && $scope.gapPenalty){
      var alignMx = new Array($scope.seq1.length);

      for(var i = 0; i < $scope.seq1.length+1; i++){
        alignMx[i] = new Array($scope.seq2.length);
        for(var j = 0; j < $scope.seq2.length+1;j++){
          alignMx[i][j] = {};
        }
      }

      alignMx[0][0].best=0;
      for(var i = 1; i < $scope.seq1.length+1; i++){
        alignMx[i][0].horiz = alignMx[i-1][0].best + $scope.gapPenalty;
        alignMx[i][0].best = Math.max(0,alignMx[i-1][0].best + $scope.gapPenalty);
      }
      for(var i = 1; i < $scope.seq2.length+1; i++) {
        alignMx[0][i].vert = alignMx[0][i-1].best + $scope.gapPenalty;
        alignMx[0][i].best = Math.max(0,alignMx[0][i-1].best + $scope.gapPenalty);
      }
      for(var i = 1; i < $scope.seq1.length+1; i++){
        for(var j = 1; j < $scope.seq2.length+1; j++) {
          alignMx[i][j].horiz = alignMx[i-1][j].best + $scope.gapPenalty;
          alignMx[i][j].vert = alignMx[i][j-1].best + $scope.gapPenalty;

          if($scope.matchMissmatch){
            if($scope.seq1[i-1] == $scope.seq2[j-1]) {
              alignMx[i][j].diag = alignMx[i-1][j-1].best + $scope.matchScore;}
            else {
              alignMx[i][j].diag = alignMx[i-1][j-1].best + $scope.missmatchScore;
            }
          }
          else{
            alignMx[i][j].diag = alignMx[i-1][j-1].best +
              $scope.matrix[$scope.seq1[i-1]][$scope.seq2[j-1]];
          }

          alignMx[i][j].best = Math.max(0, Math.max(alignMx[i][j].diag,Math.max(
                  alignMx[i][j].vert,alignMx[i][j].horiz)));
        }
      }
      $scope.lclAlign = alignMx;

    }
  };*/
}]);

angular.module('bcBootstrapApp').directive('capitalizeFirst', function($parse) {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {
      var capitalize = function(inputValue) {
        if (inputValue === undefined) { inputValue = ''; }
        var capitalized = inputValue.toUpperCase();
        if(capitalized !== inputValue) {
          modelCtrl.$setViewValue(capitalized);
          modelCtrl.$render();
        }         
        return capitalized;
      }
      modelCtrl.$parsers.push(capitalize);
      capitalize($parse(attrs.ngModel)(scope)); // capitalize initial value
    }
  };
});
