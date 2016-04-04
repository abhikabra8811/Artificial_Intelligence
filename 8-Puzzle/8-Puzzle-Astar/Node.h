#ifndef NODE_H
#define NODE_H

#include <iostream>
#include <array>
#include <memory>

using namespace std;

class Node
{
public:
	Node()=default;
	~Node()=default;
	
	//Constructor for node
	Node(shared_ptr<Node> parent, array<array < int, 3 >, 3> state);

	//Returns an array representing the state of the node
	array<array<int, 3>, 3> getState(){ return m_state;};
	
	// returns g(n)
	int getPathCostSoFar(){ return m_gCost; };
	
	//sets the path cost
	void setPathCostSoFar(const int gCost);
	
	// returns h(n)
	int getHeuristicCost(){ return m_hCost; };
	
	// sets h(n)
	void setHeuristicCost(const int hCost);
	
	// return f(n)
	inline int getEstimatedPathCost(){ return m_fCost; };

	// sets f(n)
	void setEstimatedPathCost();

public:
	shared_ptr<Node> m_parent = nullptr;
private:

	int m_fCost= 0; //Estimated path cost to goal
	int m_gCost = 0; //Path cost so far
	int	m_hCost = 0; //Heuristic cost	

	array<array < int, 3 >, 3> m_state; //array representing a state
};

#endif