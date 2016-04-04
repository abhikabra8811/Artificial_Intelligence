#include <iostream>
#include "Node.h"
#include <queue>
#include <algorithm>
#include "8-puzzle.h"

using namespace std;

void printMatrix(const array<array<int, 3>, 3>& step){
	for (int i = 0; i < 3; ++i)
	{
		for (int j = 0; j < 3; ++j)
		{
			cout << "|";
			if (step[i][j] > 0){
				cout << " " <<step[i][j] << ' ';
			}
			else{
				cout << "  " << ' ';
			}
		}
		cout << "|" <<endl;
		cout << "-------------" << endl;
	}
}

int main(){

	cout << "Use 0 for empty position" << endl;
	cout << "Enter the initial state: " << endl;
	
	//Getting input from user for initial state
	array<array < int, 3 >, 3> startState;
	for (int i = 0; i < 3; i++)
	{
		for (int j = 0; j < 3; j++)
		{
			cout << "Start State[" << i << "][" << j << "] = ";
			cin >> startState[i][j];
		}
	}

	cout << "\nStart State is :" << endl;
	cout << "-------------" << endl;
	printMatrix(startState);

	//Getting input from user for goal state
	array<array < int, 3 >, 3> goalState;
	for (int i = 0; i < 3; i++)
	{
		for (int j = 0; j < 3; j++)
		{
			cout << "Goal State[" << i << "][" << j << "] = ";
			cin >> goalState[i][j];
		}
	}

	cout << "\nGoal State is :" << endl;
	cout << "-------------" << endl;
	printMatrix(goalState);

	vector<shared_ptr<Node>> listOfStpes;
	//Creating object of puzzle solver class
	//Using startState & goalState for the last time
	//Hence convert it to rvalue reference to avoid unnecessary copy
	//in constructor of Puzzle class
	Puzzle puzzleObj(move(startState), move(goalState));
	shared_ptr<Node> goalNode = puzzleObj.solve();
	if (goalNode == nullptr){
		cout << "No solution found" << endl;
	}
	else{
		//Retrieving the path from initial state to goal state
		shared_ptr<Node> node = goalNode;
		while (node != nullptr)
		{
			listOfStpes.push_back(node);
			node = node->m_parent;
		}
	}

	//Printing step by step path from initial state to goal state
	cout << "\n Steps to goal state: " << endl;
	for (auto it = listOfStpes.crbegin(); it != listOfStpes.crend(); it++){
		cout << "-------------" << endl;
		printMatrix(it->get()->getState());
	}

	return 0;
}