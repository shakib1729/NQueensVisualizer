import React, { useState, useEffect } from "react";
import { Message, Form, Button, Grid } from "semantic-ui-react";

const NQueens = () => {
	// Create the states which will be required
	const [boardValue, setBoardValue] = useState();
	const [board, setBoard] = useState([]); // 'board' is an array
	const [currentGrid, setCurrentGrid] = useState([-1, -1]);
	const [messages, setMessages] = useState([]); // The message which will be displayed at each step

	const sleep = (milliseconds) => {
		return new Promise((resolve) => setTimeout(resolve, milliseconds));
	};
	const isSafe = (board, row, col) => {
		let N = board.length;
		// Check on top 
		for(let i=0; i<row; i++) 
			if(board[i][col]) 
				return false; // If a Queen is already placed, return false

		// Check upper diagonal on left
		for(let i=row, j=col; i>=0 && j>=0; i--, j--)
			if(board[i][j])
				return false;

		// Check upper diagonal on right
		for(let i=row, j=col; i>=0 && j<N; i--, j++)
			if(board[i][j])
				return false;

		return true; // No case of failure
	}
	// Recursive function to solve the NQueens problem
	const solveNQueens = async(board, row) => {
		if(row == board.length)
			return true; // We have successfully placed queens in all the columns

		for(let i=0; i<board.length; i++){
			// We are checking at board[i][col]
			setMessages((messages) => [...messages, `Checking row ${row} col ${i}`]);
			
			setCurrentGrid([row, i]); // Mark this grid as currently being checked
			await sleep(100); // Wait for 0.1 seconds

			// Check if it is safe to place a Queen here
			if(isSafe(board, row, i)){
				// Display that currently placing at this cell
				setMessages((messages) => [...messages, `Placing Queen at row ${row} col ${i}`]);
				
				let tempBoard = board;
				tempBoard[row][i] = 1;
				setBoard(tempBoard);

				await sleep(1000);
				if(await solveNQueens(board, row+1)){
					// If we have successfully placed the Queen here
					setCurrentGrid([-1, -1]);
					return true;
				}

				// If the current placement of Queen didn't return true,
				// then backtrack
				tempBoard = await board;

				setMessages((messages) => [...messages, `Backtracking row ${row} col ${i}`]);
				
				tempBoard[row][i] = 0;
				setBoard(tempBoard);
				await sleep(1000);
			}
		}


		return false;
	};

	const solve = () => {
		if(solveNQueens(board, 0))
			return true;
		console.log("Solution does not exist");
		return false;
	};

	// 'useEffect' runs every time page is rendered or re-rendered
	// By passing an [], it runs only once
	useEffect(() => {

	}, []);

	// The list of drop down items
	const sizeOptions = [
		{key: "4", text: "4 x 4", value: "4"},
		{key: "8", text: "8 x 8", value: "8"}
	];

	// Creating an empty board of size n*n
	// and setting the 'Board'
	const handleChange = (e, data) => {
		setBoardValue(parseInt(data.value));
		let tempBoard = []
		const n = data.value
		for(let i=0; i<n; i++){
			let row  =[];
			for(let j=0; j<n; j++)
				row.push(0);
			tempBoard.push(row);
		}
		setBoard(tempBoard);
	}

				
	return(
		<div>
			<Grid>
				<Grid.Row>
					<Grid.Column width={10}>
					{/*Select components must be rendered with a fluid prop to work correctly.*/}
					{/* 'options' take an array of dropdown*/}
					<Form.Select 
						fluid
						label = "Size"
						options = {sizeOptions}
						onChange = {handleChange}
						placeholder = "Select Size"
					/>
					</Grid.Column>
					<Grid.Column width={2}>
					  <Button color = "green" onClick = {solve} className="button">
					  	Visualize
					  </Button>
					</Grid.Column>
				</Grid.Row>
			</Grid>

			<br />
		{/* Printing the grid, if the current cell is the currentGrid, then print it differently
		    If current cell contains a Queen ,i.e. contains1, then print it */}
		{board.map((row, rowIndex) => {
			return (
				<div className="grid-row" key={rowIndex}>
					{row.map((col, colIndex) => {
						return (
							<div className = {
									rowIndex == currentGrid[0] && colIndex == currentGrid[1]
									? "grid-column current-grid"
									: board[rowIndex][colIndex] == 1
									? "grid-column queen-grid"
									: "grid-column"
								}>
							</div>
						);
					})}
				</div>
			);
		})
		}
		<Message className="console">
			<Message.Header>Console</Message.Header>
			<Message.List items = {messages} />
		</Message>
		</div>
	);
};
export default NQueens;