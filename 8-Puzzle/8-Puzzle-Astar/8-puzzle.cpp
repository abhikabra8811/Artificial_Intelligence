#include "8-puzzle.h"

//Constructor
Puzzle::Puzzle(array< array <int, 3>, 3 > startState, array< array <int, 3>, 3> goalState)
												:m_startState(makeNode(nullptr,startState)),
												m_goalState(goalState){
	//Populating lookup table for goal state
	positionsInGoalState();
}

//Create and returns a smart pointer for node
shared_ptr<Node> Puzzle::makeNode(const shared_ptr<Node>& parent, const array<array < int, 3 >, 3>& state){
	numberOfNodesCreated++;
	return make_shared<Node>(parent, state);
}

shared_ptr<Node> Puzzle::solve(){

	// Inserting start state node in priority queue
	m_NodesQueue.push(m_startState);

	while (!m_NodesQueue.empty())
	{
		shared_ptr<Node> currentNode = m_NodesQueue.top();
		m_NodesQueue.pop();
		
		if (isGoal(currentNode)){
			cout << "Number of Nodes created: " << numberOfNodesCreated << endl;
			cout << "Number of Nodes expanded: " << numberOfNodesExpanded << endl;
			return currentNode;
		}

		vector<shared_ptr<Node>> successorNodes = createSuccessorNode(currentNode);
		for (auto successor : successorNodes){
			if (currentNode->m_parent){
				//Check if new node is same as grand parent
				if (currentNode->m_parent->getState() == successor->getState()){
					continue;
				}
			}
			
			int gCost = successor->m_parent->getPathCostSoFar() + 1;
			int hCost = calculateManhattenDistanceFromGoal(successor->getState(), m_goalState);
			successor->setPathCostSoFar(gCost);
			successor->setHeuristicCost(hCost);
			successor->setEstimatedPathCost();
			m_NodesQueue.push(successor);
		}
	}

	return nullptr;
}

//checks if node matches goal state
bool Puzzle::isGoal(const shared_ptr<Node>& currentNode){
	return currentNode->getState() == m_goalState;
}

vector<shared_ptr<Node>> Puzzle::createSuccessorNode(shared_ptr<Node> node){
	vector<shared_ptr<Node>> successorNodes;
	
	int rowPos = 0; int colPos = 0;
	positionInState(0, node->getState(), rowPos, colPos);
	numberOfNodesExpanded++;

	//down operator
	if (rowPos + 1 < 3){
		array<array<int, 3>, 3> newState;
		newState = node->getState();
		newState[rowPos][colPos] = newState[rowPos + 1][colPos];
		newState[rowPos + 1][colPos] = 0;
		successorNodes.push_back(makeNode(node, newState));
	}

	//up operator
	if (rowPos - 1 >= 0){
		array<array<int, 3>, 3> newState;
		newState = node->getState();
		newState[rowPos][colPos] = newState[rowPos - 1][colPos];
		newState[rowPos - 1][colPos] = 0;
		successorNodes.push_back(makeNode(node, newState));
	}

	//right operator
	if (colPos + 1 < 3){
		array<array<int, 3>, 3> newState;
		newState = node->getState();
		newState[rowPos][colPos] = newState[rowPos][colPos+1];
		newState[rowPos][colPos+1] = 0;
		successorNodes.push_back(makeNode(node, newState));
	}

	//left operator
	if (colPos -1 >=0){
		array<array<int, 3>, 3> newState;
		newState = node->getState();
		newState[rowPos][colPos] = newState[rowPos][colPos - 1];
		newState[rowPos][colPos - 1] = 0;
		successorNodes.push_back(makeNode(node, newState));
	}

	return successorNodes;
}

//Calculate heuristic cost for node
int Puzzle::calculateManhattenDistanceFromGoal(array<array < int, 3 >, 3> currentState, array<array < int, 3 >, 3> goalState){
	int totalDist = 0;
	for (int i = 0; i < 3; i++)
	{
		for (int j = 0; j < 3; j++)
		{
			int iGoal = 0; int jGoal = 0;
			if (currentState[i][j] > 0){
				iGoal = m_positionArray[currentState[i][j]][0];
				jGoal = m_positionArray[currentState[i][j]][1];
				totalDist = totalDist + abs((iGoal - i)) + abs((jGoal - j));
			}
		}
	}

	return totalDist;
}

void Puzzle::positionInState(int iElement, array<array < int, 3 >, 3> goalState, int&iGoal, int&jGoal){
	iGoal = 0; jGoal = 0;
	for (int i = 0; i < 3; i++)
	{
		for (int j = 0; j < 3; j++)
		{
			if (goalState[i][j] == iElement)
			{
				iGoal = i; jGoal = j;
				return;
			}
		}
	}
}

//Creating a lookup table for goal state positions
void Puzzle::positionsInGoalState(){
	for (int i = 0; i < 3; i++)
	{
		for (int j = 0; j < 3; j++)
		{
			m_positionArray[m_goalState[i][j]][0] = i;
			m_positionArray[m_goalState[i][j]][1] = j;
		}
	}
}