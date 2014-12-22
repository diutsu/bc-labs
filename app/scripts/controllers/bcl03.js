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
        $scope.hamming = new Array($scope.generationsNumber);
        $scope.jukes = new Array($scope.generationsNumber);

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
            $scope.hamming[gen] = 0;
            $scope.jukes[gen]=0;
            var jukesResults = 0;
            for(var i = 0; i<sequences.length;i++){
                for(var j=i;j<sequences.length;j++){
                    var diff=0;
                    for(var n=0;n<$scope.randomSize;n++){
                        if(sequences[i][n] != sequences[j][n]){
                            diff++;
                        }
                    }
                    $scope.hamming[gen]+=diff;

                    var p = diff/$scope.randomSize;
                    if(p<0.75){
                        $scope.jukes[gen] = $scope.jukes[gen]+ -3 * Math.log(1-4*p/3)/4;
                        jukesResults++;
                    }
                }
            }
            $scope.hamming[gen] = $scope.hamming[gen]/(sequences.length*(sequences.length-1)/2);
            $scope.jukes[gen] = $scope.jukes[gen]/jukesResults;
        }

        $scope.sequences = sequences;
        $scope.outFasta = "";
        for(var i = 0; i < $scope.populationSize; i++){
            $scope.outFasta = $scope.outFasta.concat(">sequence_").concat(i).concat("\n").concat($scope.sequences[i]).concat("\n\n");

        }
        $scope.totalTime = Date.now() - $scope.initTime;


        var node = document.getElementById("hammingGr");
        node.removeChild(node.lastChild);
        node = document.getElementById("jukesGr");
        node.removeChild(node.lastChild);
        node = document.getElementById("bothGr");
        node.removeChild(node.lastChild);

        d3.select("svg").remove();
        //Graph computation
        
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
        var drawGraph = function(vis, lineclass, data, y){
            var x = d3.scale.linear().domain([0, data.length]).range([0 + margin, w - margin]);

            var g = vis.append("svg:g")
                .attr("transform", "translate(0, 200)");


            var line = d3.svg.line()
                .x(function(d,i) { return x(i); })
                .y(function(d) { return -1 * y(d); });

            g.append("svg:path").attr("class",lineclass).attr("d", line(data));

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


        }
        var y = d3.scale.linear().domain([0, d3.max($scope.hamming)]).range([0 + margin, h - margin]);
        drawGraph(hammingGr, "", $scope.hamming,y);
        y = d3.scale.linear().domain([0, d3.max($scope.jukes)]).range([0 + margin, h - margin]);
        drawGraph(jukesGr, "green", $scope.jukes,y);
        drawGraph(bothGr, "", $scope.hamming,y);
        drawGraph(bothGr, "green", $scope.jukes,y);
    }
}]);

