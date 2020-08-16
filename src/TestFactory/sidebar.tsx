import * as React from 'react';
import { globalBoard, globalStepNavigator, Givens, IndexedStepResult } from './Given';
import * as ReactDOM from 'react-dom';
import { WhenStep as When } from './When';
import { ThenStep as Then } from './Then';
import { StepResult, TestStepTurn } from './testStep';
import { Board } from 'Board';
import { IQueuingMachine } from './QueuingMachine';
function compose(globalBoard: Board, globalStepNavigator: IQueuingMachine<TestStepTurn>) {

}
function TestBuilder(props) {

	React.useEffect(() => {
		globalBoard.unselectAll()
			.then(globalStepNavigator.start)
	}, [])


	async function getBoardTitle() {
		let boardInfo = await miro.board.info.get();
		// this.setState({ boardTitle: boardInfo.title });
	}

	const [givenResult, setGivenResult] = React.useState<IndexedStepResult[]>()
	const [whenResult, setWhenResult] = React.useState<StepResult>()
	const [thenResult, setThenResult] = React.useState<StepResult>()

	const updateGivens = (givenResults: IndexedStepResult[]) => {
		setGivenResult(givenResults)
	}
	const updateWhen = (when: StepResult) => {
		setWhenResult(when)
	}
	const updateThen = (when: StepResult) => {
		setThenResult(when)
	}
	const save = () => {
		alert('Given:\n' + JSON.stringify(givenResult) + '\n'
			+ 'When:\n' + JSON.stringify(whenResult) + '\n'
			+ 'Then:\n' + JSON.stringify(thenResult) + '\n')
	}
	return (
		<div>

			<Givens onChange={updateGivens} data={givenResult}
			/>


			<When onChange={updateWhen} data={whenResult}
			// canEdit={s => this.test?.when?.title != null} 
			/>

			<Then onChange={updateThen} data={thenResult}
			// canEdit={s => this.test?.then?.title != null
			// 	&& this.test?.when?.example != null} 
			/>

			<button className='build-button' onClick={save}>Save</button>

		</div>
	);
}
ReactDOM.render(
	<TestBuilder />,
	document.getElementById('react-app')
)