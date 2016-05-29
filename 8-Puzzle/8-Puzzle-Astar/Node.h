#ifndef NODE_H
#define NODE_H

#include <iostream>
#include <array>
#include <memory>

using std::array;
using std::shared_ptr;

class Node
{
public:
	Node() = default;
	//Constructor for node
	Node(shared_ptr<Node> parent, const array<array < int, 3 >, 3>& state);

	~Node() = default;

	//Returns an array representing the state of the node
	array<array<int, 3>, 3> getState() const { return m_state;};
	
	// returns g(n)
	int getPathCostSoFar() const { return m_gCost; };
	
	//sets the path cost
	inline void setPathCostSoFar(const int gCost);
	
	// returns h(n)
	int getHeuristicCost() const { return m_hCost; };
	
	// sets h(n)
	inline void setHeuristicCost(const int hCost);
	
	// return f(n)
	int getEstimatedPathCost() const { return m_fCost; };

	// sets f(n)
	inline void setEstimatedPathCost();

	void updatePathCost(const int gcost, const int hcost);

public:
	shared_ptr<Node> m_parent = nullptr;
private:

	int m_fCost= 0; //Estimated path cost to goal
	int m_gCost = 0; //Path cost so far
	int	m_hCost = 0; //Heuristic cost	

	array<array < int, 3 >, 3> m_state; //array representing a state
};

#endif