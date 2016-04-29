/**
 * Created by Abhishek on 12/1/2015.
 */

//Stores list of contraint graph nodes (in this case node of state/country)
var mapNodes = [];

//Stores list of remaining unassiagned variable
var listOfRemNode = [];

//Array that stores neighbours for each graph node (adjacency list)
var neighbours = [];

//Stores list of countries / states from json file
var countries = [];

var numOfDeadEnds = 0;
var numOfRecursiveCalls = 0;

//Class of constraint graph node
function MapNode (mapArrayIndex) {
    this.mapArrayIndex = mapArrayIndex;
    this.color = "Black"; // Default color
    this.legalColors = ["Red", "Green", "Blue", "Orange"]; //Allowed colors
    this.legalColors.sort();
    this.isColorSet =false;
    this.neighbours = neighbours[mapArrayIndex]; //neighbour of this node
}

//Returns color of the node
MapNode.prototype.getColor = function(){
    return this.color;
};

//Sets color to the graph(map) node
MapNode.prototype.setMapNodeColor = function(i){
    this.isColorSet = true;
    this.color = this.legalColors[i];
    /*As soon as color is assinged to a node do forward checking
    i.e. remove currently used color from domain of neighobouring
    variables*/
    this.forwardChecking();
};

/* Unset node color if dead end is encountered in
in search due to domain wipeout*/
MapNode.prototype.unSetMapNodeColor = function(){
    this.isColorSet = false;
    /*Add currently unset domain value for neighboring nodes as
    neighbouring nodes can have recently unset value*/
    this.restoreNeighbours();
    this.color = "Black";
};

/*Adds currently unset domain value for neighboring nodes as
 neighbouring nodes can have recently unset value*/
MapNode.prototype.restoreNeighbours = function() {
    for (var i = 0; i < this.neighbours.length; i++) {
        var neighbour = mapNodes[this.neighbours[i]];
        if (neighbour.isColorSet == false) {
            var index =neighbour.legalColors.indexOf(this.color);
            if(index == -1)
            {
                neighbour.legalColors.push(this.color);
                neighbour.legalColors.sort();
            }
        }
    }
};

/*Updates the domain value for neighbouring nodes*/
MapNode.prototype.forwardChecking = function(){
    for(var i = 0; i<this.neighbours.length; i++){
        var neighbour = mapNodes[this.neighbours[i]];
        if(neighbour.isColorSet == false)
        {
            neighbour.deleteValueFromDomain(this.color);
        }
    }
};

/*Deletes input domain value from domain*/
MapNode.prototype.deleteValueFromDomain = function(color){
    var index = this.legalColors.indexOf(color);
    if(index >= 0)
    {
        this.legalColors.splice(index, 1);
    }

};

/*Checks if assignments satisfies constraint that no two
neighbouring nodes can have same color,
returns true if constraints are satisfied*/
MapNode.prototype.satisfyConstraint = function(color){
    for(var i = 0; i<this.neighbours.length; i++){
        var neighbour = mapNodes[this.neighbours[i]];
        if(neighbour.isColorSet == true)
        {
            if(neighbour.color == color)
            {
                return false;
            }
        }
    }
    return true;
};

/*Iterates through list of countries/States and creates an
array of objects of custom class MapNode*/
function  createCountryNode(){
    for(var i = 0; i < countries.length; i++){
        mapNodes[i]  = new MapNode(i);
        listOfRemNode[i] = mapNodes[i];
    }
}

/*Main function called from HTML file*/
function colorMapWithFCMRV(iCountries, iNeighbours){
    countries = iCountries;
    neighbours = iNeighbours;

    createCountryNode();

    //Does Minimum remaining value using forward checking
    fcMRV();
    console.log("Number of dead-ends encountered: " + numOfDeadEnds);
    console.log("Number of recursrive calls: " + numOfRecursiveCalls);
    return mapNodes;

}

/*Recursive function that solves CSP using minimum remaining value
and forward checking*/
function fcMRV() {

    numOfRecursiveCalls++;
    if(listOfRemNode.length <=0){
        return mapNodes;
    }

    //nextNode is null if all variables are assigned
    var nextNode = pickUnassignedVariable();
    if(nextNode == null){
        return null;
    }

    //Domain wipeout -- Algorithm backtracks
    if(nextNode.legalColors.length <=0){
        numOfDeadEnds++;
        return null;
    }

    //Loop to try all domain values
    for(var i = 0; i<nextNode.legalColors.length; i++){
        var consSatisfied =nextNode.satisfyConstraint(nextNode.legalColors[i]);
        if(consSatisfied == true) {
            nextNode.setMapNodeColor(i);
            removeColoredNodeFromList(nextNode);
            var result = fcMRV();
            if (result == null) {
                /*Since that result is null, means current assignments creates inconsistent
                assignments. Unset current assignment. Try next next domain value*/
                nextNode.unSetMapNodeColor();
                listOfRemNode.push(nextNode);
            }
            else{
                return mapNodes; /*If result is not null meaning that we have found a solution*/
            }
        }
    }
    return null;
}

/*Selects the unassigned variables with minimum remaining value.
Uses degree heuristic as a tie breaker.*/
function pickUnassignedVariable(){
    var mrvNodes = [];
    var currentMRV = 4;
    for(i = 0; i < listOfRemNode.length; i++) {
        var currentMapMode = listOfRemNode[i];
        if(currentMapMode.legalColors.length < currentMRV) {
            if(currentMapMode.isColorSet == false) {
                currentMRV = currentMapMode.legalColors.length;
                while (mrvNodes.length) {
                    mrvNodes.pop();
                }
                mrvNodes.push(currentMapMode);
            }
        }
        else if(currentMapMode.legalColors.length == currentMRV){
            if(currentMapMode.isColorSet == false){
                mrvNodes.push(currentMapMode);
            }
        }
    }

    return getNodeWithHighestDegree(mrvNodes);
}

/*Returns the node with highest degree i.e.
a node with highest number of neighbours*/
function getNodeWithHighestDegree(listOfNodes){

    if(listOfNodes.length <= 0)
        return null;

    var indCountriesWithMaxNeighbour = 0;
    for(i = 0; i < listOfNodes.length; i++){
        if(getNumOfUnAssignedNeighbours(listOfNodes[indCountriesWithMaxNeighbour])< getNumOfUnAssignedNeighbours(listOfNodes[i]))
        {
            indCountriesWithMaxNeighbour = i;
        }
    }
    return listOfNodes[indCountriesWithMaxNeighbour];
}

/*Deletes a node from list of remaining nodes to be colored*/
function removeColoredNodeFromList(node){

    var index = listOfRemNode.indexOf(node);
    if(index >= 0){
        listOfRemNode.splice(index, 1);
    }

}

/*Returns number of unassigned neighboring nodes
of input node*/
function getNumOfUnAssignedNeighbours(node){
    var numNeighbours = 0;
    for(var i = 0; i < node.neighbours.length; i++)
    {
        var neighbourNode = mapNodes[node.neighbours[i]];
        //if(neighbourNode.isColorSet == false){
            numNeighbours++;
        //}
    }
    return numNeighbours;
}
