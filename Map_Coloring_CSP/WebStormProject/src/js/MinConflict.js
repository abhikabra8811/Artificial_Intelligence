/**
 * Created by Abhishek on 12/4/2015.
 */
//Stores list of constraint graph nodes (in this case node of state/country)
var mapNodesMC = [];

//Stores list of remaining unassigned variable
var listOfRemNode = [];

//Array that stores neighbours for each graph node (adjacency list)
var neighbours = [];

//Stores list of countries / states from json file
var countries = [];

var connectedComponents = [];

var numOfRestarts = 0;
var numOfTotalSteps = 0;

//Class of constraint graph node
function McMapNode(mapArrayIndex) {
    this.isVisited = false;
    this.mapArrayIndex = mapArrayIndex;
    this.color = "Black"; // Default color
    this.legalColors = ["Red", "Green", "Blue", "Orange"]; //Allowed colors
    this.legalColors.sort();
    this.isColorSet =false;
    this.neighbours = neighbours[mapArrayIndex]; //neighbour of this node
}

/*Assigns color to node randomly from domain*/
McMapNode.prototype.assignRandomColor = function(colors){
    var i = Math.floor((Math.random() * (colors.length)) + 0);
    this.color = colors[i];
};

/*Helper method to set color*/
McMapNode.prototype.setColor = function(color){
    this.color = color;
};

/*Assigns random colors to all the nodes in the input list
Used to do random restart if search gets stuck in local minima*/
function randomStart(listOfNodes){
    var node;
    for (var i= 0; i < listOfNodes.length; i++){
        var node = listOfNodes[i];
        node.assignRandomColor(node.legalColors);
    }
}

/*Iterates through list of countries/States and creates an
 array of objects of custom class McMapNode*/
function  createCountryNodeMC(){
    for(var i = 0; i < countries.length; i++){
        mapNodesMC[i]  = new McMapNode(i);
    }
}

/*Main function called from HTML*/
function colorMapWithMinConflicts(iCountries, iNeighbours){
    countries = iCountries;
    neighbours = iNeighbours;
    createCountryNodeMC();
    randomStart(mapNodesMC);
    getConnectedComponents();

    for (var i = 0; i < connectedComponents.length; i++){
        var component = connectedComponents[i];
        var result = solveCSPWithMinConflict(component);
        if(result == false) {
            break;
        }
    }

    console.log("Number of total steps of by algorithm: " + numOfTotalSteps);
    console.log("Number of random restarts required by algorithm: " + numOfRestarts);

    return mapNodesMC;
}

/*Gets connected component of constraint graph*/
function getConnectedComponents(){
    for(var i = 0; i< mapNodesMC.length; i++){
        var node = mapNodesMC[i];
        if(node.isVisited == false){
            var listOfNodes = [];
            traverseDepth(node, listOfNodes);
            connectedComponents.push(listOfNodes);
        }
    }
}

/*recursive function to do topological sorting*/
function traverseDepth(node,listOfNodes){
    node.isVisited = true;
    listOfNodes.push(node);
    for(var i = 0; i < node.neighbours.length; i++){
        var neighbour = mapNodesMC[node.neighbours[i]];
        if(neighbour.isVisited == false){
            //neighbour.isVisited = true;
            traverseDepth(neighbour,listOfNodes);
        }
    }
}


/*solves CSP for each component*/
function solveCSPWithMinConflict(component){
    var totalConflicts = 0;
    var restartAfter = component.length * 50;
    for(var i = 1; i <= 1000000; i++){
        numOfTotalSteps++;
        if(i % restartAfter == 0){
            numOfRestarts++;
            randomStart(component);
        }
        totalConflicts = getNumOfConflictsOfComponent(component);
        /*If total conflicts are 0, meaning solution is found*/
        if(totalConflicts == 0){
            console.log("Steps required for component of size :" + component.length + " is " + i);
            return true;
        }
        var node = pickConflictedVariable(component);
        var color = selectValWithMinConflicts(node);
        node.setColor(color);
    }

    return false;
}

/*Returns total number conflicts for input component*/
function getNumOfConflictsOfComponent(component){
    var totalConflicts = 0;
    for(var i = 0; i < component.length; i++){
        totalConflicts += getConflictOfNode(component[i]);
    }
    return totalConflicts;
}


function getConflictOfNode(node){
    var numOfConflicts = 0;
    for(var i = 0; i<node.neighbours.length; i++){
        var neighbour = mapNodesMC[node.neighbours[i]];
        if(neighbour.color == node.color)
        {
            numOfConflicts++;
        }
    }
    return numOfConflicts;
}

/*Randomly picks conflicted*/
function pickConflictedVariable(component){

    var maxConflict = 0;
    var maxConflictVar = null;

    while (maxConflictVar == null){
        var i = Math.floor((Math.random() * (component.length)) + 0);
        var totalConflicts = getConflictOfNode(component[i]);
        if(totalConflicts > 0){
                maxConflictVar = component[i];
        }
    }
    return maxConflictVar;
}

/*Function selects value from the domain which
minimizes total number of conflict with neighvoring nodes*/
function selectValWithMinConflicts(node){
    var currentColor = node.color;
    var minConflicts = node.neighbours.length;
    for(var i = 0; i < node.legalColors.length; i++){
        if(node.legalColors[i] == node.color){
            continue;
        }
        var numOfConflicts = 0;
        for(var j = 0; j<node.neighbours.length; j++){
            var neighbour = mapNodesMC[node.neighbours[j]];
            if(neighbour.color == node.legalColors[i])
            {
                numOfConflicts++;
            }
        }
        if(numOfConflicts <= minConflicts){
            minConflicts = numOfConflicts;
            currentColor = node.legalColors[i];
        }
    }
    return currentColor;
}
