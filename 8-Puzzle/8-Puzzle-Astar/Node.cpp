#include "Node.h"

Node::Node(shared_ptr<Node> parent,
	const array<array < int, 3 >, 3>& state):
	m_parent(parent), 
	m_state(state){}

void Node::setEstimatedPathCost(){
	m_fCost = m_gCost + m_hCost;
}

void Node::setPathCostSoFar(const int gCost){
	m_gCost = gCost;
}

void Node::setHeuristicCost(const int hCost){
	m_hCost = hCost;
}

void Node::updatePathCost(const int gcost, const int hcost) {
	setPathCostSoFar(gcost);
	setHeuristicCost(hcost);
	setEstimatedPathCost();
}