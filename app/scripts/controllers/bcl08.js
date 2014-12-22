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
    // one might want to use different letters, who knows
    $scope.acid = ['A','T','G','C'];
    $scope.sequenceSize = 100;
    $scope.populationSize = 100;
    $scope.allAreBornEqual = true;
    $scope.rr = .01;
    $scope.mr = .01;
    $scope.rfl = 5;
    $scope.generationsNumber = 5000;
    $scope.mergeFasta = false;

    $scope.createPopulation = function(){
      var rndSeq = "";
      $scope.fasta = "";

        // sequence generation
      if($scope.allAreBornEqual){
        // every sequence is the same
        for(var i = 0; i < $scope.sequenceSize; i++){
          rndSeq = rndSeq.concat($scope.acid[ Math.floor(Math.random()*($scope.acid.length))]);
        }
        // generating fasta
        for(var i = 0; i < $scope.populationSize; i++){
          $scope.fasta = $scope.fasta.concat(">sequence_").concat(i+1).concat("\n").concat(rndSeq).concat("\n\n");
        }
      } else {
        // all the start sequences can be different
        for(var j = 0; j< $scope.populationSize; j++){
          rndSeq = "";
          for(var i = 0; i < $scope.sequenceSize; i++){
            rndSeq = rndSeq.concat($scope.acid[ Math.floor(Math.random()*($scope.acid.length))])
          }
          $scope.fasta = $scope.fasta.concat(">sequence_").concat(j+1).concat("\n").concat(rndSeq).concat("\n\n");
        }
      }
    }

    // final fasta generator, in case we want to merge things
    $scope.createFinalFasta =  function(){
        var offset = 0;
        if($scope.mergeFasta) {
            $scope.outFasta = $scope.fasta;
            offset=$scope.populationSize;
        }   else {
            $scope.outFasta = "";
            offset=0;
        }

        for(var i = 0; i < $scope.populationSize; i++){
            $scope.outFasta = $scope.outFasta.concat(">sequence_").concat(i+offset+1).concat("\n")
            for(var j = 0; j < $scope.sequenceSize; j++){
                $scope.outFasta = $scope.outFasta.concat($scope.sequences[i][j]);
            }
            $scope.outFasta = $scope.outFasta.concat("\n\n");
        }
    };

    //evolution
    $scope.evolvePopulation = function(){

        $scope.initTime = Date.now();

        var fastaArray = $scope.fasta.split("\n");
        $scope.fastaArray = fastaArray;
        $scope.names = new Array($scope.populationSize-1);
        $scope.sequences = new Array($scope.populationSize-1);
        $scope.hamming = new Array($scope.generationsNumber);
        $scope.jukes = new Array($scope.generationsNumber);

        // read fasta (it can be changed from the previous generation)
        for(var i = 0; i< fastaArray.length; i++){
            if(i%3 == 0){
                $scope.names[Math.floor(i/3)] = fastaArray[i];
            }
            if(i%3 == 1){

                $scope.sequences[Math.floor(i/3)] = new Array($scope.sequenceSize);
                for(var j = 0; j< $scope.sequenceSize;j++){
                    $scope.sequences[Math.floor(i/3)][j] = fastaArray[i][j];
                }
            }
        }

        // var logtxt =""
        var sequences = $scope.sequences;
        // simulating the generations
        for(var gen = 0; gen < $scope.generationsNumber; gen++){

            //mutatations
            for(var i = 0; i < sequences.length; i++){
                if (Math.random() <= $scope.mr){
                    var pos = Math.floor(Math.random()*$scope.sequenceSize);

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
                    // verbose log

                    //     logtxt = logtxt.concat("On generation ").concat(gen).concat(", ").concat($scope.names[i]).concat(' position ').concat(pos).concat(' mutated ').concat($scope.acid[oldValPos]).concat(' to ').concat($scope.acid[newVal]).concat("\n");
                }
            }

            //recombinate
            for(var i = 0; i < sequences.length; i++){
                if (Math.random() <= $scope.rr){
                    var pos = Math.floor(Math.random()*($scope.sequenceSize-$scope.rfl));

                    var srcSeq = Math.floor(Math.random()*(sequences.length-1));
                    if (srcSeq >= i){
                        srcSeq++;
                    }

                    for(var j = 0; j< $scope.rfl;j++){
                        sequences[i][pos+j] =  sequences[srcSeq][pos+j];
                    }

                    // verbose log
                    //   logtxt = logtxt.concat("On generation ").concat(gen).concat(", ").concat($scope.names[i]).concat(' position ').concat(pos).concat(' recombinated ').concat($scope.acid[oldValPos]).concat(' with ').concat($scope.names[srcSeq]).concat(", ").concat(sequences[srcSeq]).concat("\n");
                }

            }

            //calculate both jukes and hamming distances
            $scope.hamming[gen] = 0;
            $scope.jukes[gen]=0;
            var jukesResults = 0;
            for(var i = 0; i<sequences.length;i++){
                for(var j=i;j<sequences.length;j++){
                    //diff is the number of differences between two sequences
                    var diff=0;
                    for(var n=0;n<$scope.sequenceSize;n++){
                        if(sequences[i][n] != sequences[j][n]){
                            diff++;
                        }
                    }

                    //hamming
                    $scope.hamming[gen]+=diff;

                    // jukes
                    var p = diff/$scope.sequenceSize;
                    if(p<0.75){
                        $scope.jukes[gen] = $scope.jukes[gen]+ -3 * Math.log(1-4*p/3)/4;
                        jukesResults++;
                    }
                }
            }

            // averaging
            $scope.hamming[gen] = $scope.hamming[gen]/(sequences.length*(sequences.length-1)/2);
            $scope.jukes[gen] = $scope.jukes[gen]/jukesResults;

        }

        // generate fasta
        $scope.sequences = sequences;
        $scope.createFinalFasta();
        // measuring the execution time
        $scope.totalTime = Date.now() - $scope.initTime;

        //Graph computation

        // cleaning previous graphs
        var node = document.getElementById("hammingGr");
        node.removeChild(node.lastChild);
        node = document.getElementById("jukesGr");
        node.removeChild(node.lastChild);
        node = document.getElementById("bothGr");
        node.removeChild(node.lastChild);

        d3.select("svg").remove();

        // creating new graph areas
        var w = 400;
        var h = 200;
        var margin = 20;
        var hammingGr = d3.select("#hammingGr")
            .append("svg:svg")
            .attr("width", w)
            .attr("height", h);
        var jukesGr = d3.select("#jukesGr")
            .append("svg:svg")
            .attr("width", w)
            .attr("height", h);
        var bothGr = d3.select("#bothGr")
            .append("svg:svg")
            .attr("width", w)
            .attr("height", h);

        // draw graph line
        var drawPlot = function(g, lineclass, data, y){

            var line = d3.svg.line()
                .x(function(d,i) { return x(i); })
                .y(function(d) { return -1 * y(d); });

            g.append("svg:path").attr("class",lineclass).attr("d", line(data));


        }

        // draw axis and labels, this is not perfect, but I can't do better yet
        var drawGraph = function(vis){

            var g = vis.append("svg:g")
                .attr("transform", "translate(0, 200)");

            g.append("svg:line")
                .attr("x1", x(0))
                .attr("y1", -1 * y(0))
                .attr("x2", x(w))
                .attr("y2", -1 * y(0));

            g.append("svg:line")
                .attr("x1", x(0))
                .attr("y1", -1 * y(0))
                .attr("x2", x(0))
                .attr("y2", -1 * y(d3.max(data)));

            g.selectAll(".xLabel")
                .data(x.ticks(5))
                .enter().append("svg:text")
                .attr("class", "xLabel")
                .text(String)
                .attr("x", function(d) { return x(d) })
                .attr("y", 0)
                .attr("text-anchor", "middle");

            g.selectAll(".yLabel")
                .data(y.ticks(4))
                .enter().append("svg:text")
                .attr("class", "yLabel")
                .text(String)
                .attr("x", 0)
                .attr("y", function(d) { return -1 * y(d) })
                .attr("text-anchor", "right")
                .attr("dy", 4);

            g.selectAll(".xTicks")
                .data(x.ticks(5))
                .enter().append("svg:line")
                .attr("class", "xTicks")
                .attr("x1", function(d) { return x(d); })
                .attr("y1", -1 * y(0))
                .attr("x2", function(d) { return x(d); })
                .attr("y2", -1 * y(-0.3));

            g.selectAll(".yTicks")
                .data(y.ticks(4))
                .enter().append("svg:line")
                .attr("class", "yTicks")
                .attr("y1", function(d) { return -1 * y(d); })
                .attr("x1", x(-0.3))
                .attr("y2", function(d) { return -1 * y(d); })
                .attr("x2", x(0));

                return g;
        }

        // Hamming distance graph
        // x doesn't change from jukes to hamming
        var data = $scope.hamming;
        var x = d3.scale.linear().domain([0, data.length]).range([0 + margin, w - margin]);
        var y = d3.scale.linear().domain([0, d3.max(data)]).range([0 + margin, h - margin]);
        var g = drawGraph(hammingGr);
        drawPlot(g, "", data, y);

        // Jukes graph
        data = $scope.jukes;
        y = d3.scale.linear().domain([0, d3.max(data)]).range([0 + margin, h - margin]);
        g = drawGraph(jukesGr);
        drawPlot(g, "green", data,y);


        // Both graphs, one over the other
        g =drawGraph(bothGr);
                y = d3.scale.linear().domain([0, d3.max(data)*10]).range([0 + margin, h - margin]);
        drawPlot(g, "green", data,y);
        data = $scope.hamming;
        drawPlot(g, "", data,y);
    }
    $scope.testUndefined = function(obj){
        return typeof obj == "undefined";
    };
}]);

