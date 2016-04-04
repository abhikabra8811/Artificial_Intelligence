#ifndef puzzle_h
#define puzzle_h
#include <array>
#include <queue>
#include <functional>
#include <memory>
#include <algorithm>
#include "Node.h"

using namespace std;

//Comparator class for priority queue
struct CompareNode
{
	bool operator()(const shared_ptr<Node> & lhs, const shared_ptr<Node> & rhs)
	{
		if (lhs->getEstimatedPathCost() == rhs->getEstimatedPathCost()){
			return lhs->getHeuristicCost() > rhs->getHeuristicCost();
		}
		return lhs->getEstimatedPathCost() > rhs->getEstimatedPathCost();
	}
};

class Puzzle
{
public:

	//Contructor with start and goal state
	Puzzle(array<array <int, 3>, 3 > startState, array<array <int, 3>, 3> goalState);
	Puzzle() = delete;
	~Puzzle()=default;

	//Method called to solve puzzle
	shared_ptr<Node> solve();

private:

	//Check if input state is a goal state
	bool isGoal(const shared_ptr<Node>& currentNode);

	//Creates Node and return smart pointer to the node
	shared_ptr<Node> makeNode(const shared_ptr<Node>& parent, const array<array < int, 3 >, 3>& state);

	//Performs operations to create successor node and return a vector containing nodes
	vector<shared_ptr<Node>> createSuccessorNode(shared_ptr<Node> node);
	
	//calculates manhatten dist hueristic for input state
	int calculateManhattenDistanceFromGoal(array<array < int, 3 >, 3> currentState, array<array < int, 3 >, 3> goalState);
	
	//determines row and col position of input element
	void positionInState(int iElement, array<array < int, 3 >, 3> goalState, int&iGoal, int&jGoal);
	
	//Creates a lookup table for elements in goal state
	void positionsInGoalState();

private:

	shared_ptr<Node> m_startState; 
	array<array < int, 3 >, 3>  m_goalState; 
	array<array<int, 2>, 9> m_positionArray; //lookup table for goal state
	priority_queue<shared_ptr<Node>, vector<shared_ptr<Node>>, CompareNode> m_NodesQueue;

	int numberOfNodesCreated = 0;
	int numberOfNodesExpanded = 0;
};

#endif