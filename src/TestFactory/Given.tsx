require('./styles.less')
import * as React from 'react'
import { Board } from '../Board';
import { QueuingMachine } from './QueuingMachine';
import { testStep, TestStepTurn, TestStepProps, TestStepOptions, StepResult } from './testStep';


class ImmediateQueuingMachine<T>{
	onTurn = (_: T, whatToDo: () => void) => whatToDo()
	start = () => { }
	nextTurn = () => { }
}

export const globalBoard = new Board()
export const globalStepNavigator = new QueuingMachine([TestStepTurn.When, TestStepTurn.Then, TestStepTurn.Given])

function GivenStep(props: TestStepProps) {

	var Step = testStep({
		board: globalBoard,
		stepNavigator: new ImmediateQueuingMachine<TestStepTurn>(),
		stepDisplayTitle: '',
		selectionWaitingMessage: 'Select minimum required steps for the when to end up then.',
		turn: TestStepTurn.Given,
	});
	return <Step {...props} />
}
export const Givens = GivenSteps({
	board: globalBoard,
	stepNavigator: globalStepNavigator,
	stepDisplayTitle: TestStepTurn.Given,
	selectionWaitingMessage: 'Select minimum required steps for the when to end up then.',
	turn: TestStepTurn.Given,
})
export type IndexedStepResult = {
	index: number
	stepResult: StepResult
}
export type GivenStepsProps = {
	onChange: (stepResults: IndexedStepResult[]) => void
	data?: IndexedStepResult[]
}
function GivenSteps(options: TestStepOptions) {
	type State = {
		isActive: boolean
		data: IndexedStepResult[]
	}

	return class GivenSteps extends React.Component<GivenStepsProps, State> {

		constructor(props) {
			super(props)
			this.nextId = 1
			this.add = this.add.bind(this)
			this.state = {
				isActive: false,
				data: []
			}
		}

		componentDidMount() {
			globalStepNavigator.onTurn(TestStepTurn.Given, () => {
				this.setState({ isActive: true })
				if (this.props.data)
					this.setState({ data: this.props.data })
			})
		}
		nextId: number
		add(event) {
			const data = this.state.data;
			data.unshift({ index: this.nextId } as IndexedStepResult)
			this.nextId++;
			this.setState({ data: data })
		}
		onChange = (updated: StepResult) => {
			const data = this.state.data.map(
				theOld => theOld.stepResult == undefined || theOld.stepResult.metadata.widget.id === updated.metadata.widget.id
					? { stepResult: updated, index: theOld.index } as IndexedStepResult
					: theOld)
			this.setState({ data: data })
			this.props.onChange(data)
			console.log("onChange:", data)
		}
		render = () => {
			return (
				<div>
					<h1>Given</h1>


					{
						this.state.data.map(data =>
							<GivenStep
								onChange={this.onChange}
								data={data.stepResult}
								key={data.index}
							/>)
					}
					{this.state.isActive &&
						<>
							{/* <h3>{options.selectionWaitingMessage}</h3> */}
							<button className="add-row-button"
								onClick={this.add.bind(this)}>
								+ Given
							</button>
						</>
					}
				</div>
			)
		}
	}
}

