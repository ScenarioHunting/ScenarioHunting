require('./styles.less')
import * as React from 'react'
import { Board } from '../Board';
import { QueuingMachine } from './queuing-machine';
import { testStepRecorder, TestStepTurn, TestStepProps, TestStepOptions } from './TestStepRecorder';
import { Step } from "./step";


class ImmediateQueuingMachine<T>{
	onTurn = (_: T, whatToDo: () => void) => whatToDo()
	start = () => { }
	nextTurn = () => { }
}

export const globalBoard = new Board()
export const globalStepNavigator = new QueuingMachine([TestStepTurn.When, TestStepTurn.Then, TestStepTurn.Given])

function GivenStep(props: TestStepProps) {

	var Step = testStepRecorder({
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
export type IndexedStep = {
	index: number
	step: Step
}
export type GivenStepsProps = {
	onStepSelectionChange: (stepResults: IndexedStep[]) => void
	steps?: IndexedStep[]
}
function GivenSteps(options: TestStepOptions) {
	type State = {
		isActive: boolean
		indexedSteps: IndexedStep[]
	}

	return class GivenSteps extends React.Component<GivenStepsProps, State> {

		constructor(props) {
			super(props)
			this.nextId = 1
			this.add = this.add.bind(this)
			this.state = {
				isActive: false,
				indexedSteps: []
			}
		}

		componentDidMount() {
			globalStepNavigator.onTurn(TestStepTurn.Given, () => {
				this.setState({ isActive: true })
				if (this.props.steps)
					this.setState({ indexedSteps: this.props.steps })
			})
		}
		nextId: number
		add(event) {
			const data = this.state.indexedSteps;
			data.unshift({ index: this.nextId } as IndexedStep)
			this.nextId++;
			this.setState({ indexedSteps: data })
		}
		onStepSelection = (updatedStep: Step) => {
			// function replace<T>(arr: Array<T>, newItem: T, predicate: (old: T) => Boolean) {
			// }
			const replaceOldIfEqual = (oldStep: IndexedStep, updatedStep: Step) => {

				const oldEqualsNew: boolean = oldStep.step == undefined
					|| oldStep.step.metadata.widget.id === updatedStep.metadata.widget.id

				return oldEqualsNew
					? { step: updatedStep, index: oldStep.index } as IndexedStep
					: oldStep
			}

			const indexedStep = this.state.indexedSteps.map(oldStep => replaceOldIfEqual(oldStep, updatedStep))

			this.setState({ indexedSteps: indexedStep })

			this.props.onStepSelectionChange(indexedStep)
			console.log("onChange:", indexedStep)
		}
		render = () => {
			return (
				<div>
					<h1>Given</h1>
					
					{this.state.isActive &&
						<>
							{/* <h3>{options.selectionWaitingMessage}</h3> */}
							<button className="add-step-button"
								onClick={this.add.bind(this)}>
								+ Given
							</button>
						</>
					}
					{
						this.state.indexedSteps.map(data =>
							<GivenStep
								onStepSelection={this.onStepSelection}
								step={data.step}
								key={data.index}
							/>)
					}
				</div>
			)
		}
	}
}

