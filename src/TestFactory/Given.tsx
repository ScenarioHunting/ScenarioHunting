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
		stepTitle: TestStepTurn.Given,
		selectionWaitingMessage: 'Select minimum required steps for the when to end up then.',
		turn: TestStepTurn.Given,
	});
	return <Step {...props} />
}
export const Givens = GivenSteps({
	board: globalBoard,
	stepNavigator: globalStepNavigator,
	stepTitle: TestStepTurn.Given,
	selectionWaitingMessage: 'Select minimum required steps for the when to end up then.',
	turn: TestStepTurn.Given,
	// onWidgetSelection: transit(TestStepTurn.Given + index, TestStepTurn.Given + index + 1)
})
type IndexedStepResult = {
	index: number
	stepResult: StepResult
}
function GivenSteps(options: TestStepOptions) {
	type State = {
		isActive: boolean
		data: IndexedStepResult[]
	}
	return class GivenSteps extends React.Component<TestStepProps, State> {

		constructor(props: TestStepProps) {
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
			})
		}
		nextId: number
		add(event) {
			const data = this.state.data;
			data.unshift({ index: this.nextId } as IndexedStepResult)
			this.nextId++;
			// const {extraProp, ...passThroughProps } =this.props
			this.setState({ data: data })
			// this.setState({ preconditions: this.state.preconditions.concat({ id: this.state.preconditions.length, value: null }) })
		}
		onChange = (updated: StepResult) => {
			const data = this.state.data.map(
				theOld => theOld.stepResult == undefined || theOld.stepResult.widget.id === updated.widget.id
					? { stepResult: updated, index: theOld.index } as IndexedStepResult
					: theOld)
			this.setState({ data: data })
			console.log("onChange:", data)
		}
		render = () => {
			return (
				<div>
					<h1>GivenCollection</h1>

					{this.state.isActive &&
						<>
							<h3>{options.selectionWaitingMessage}</h3>
							<button className="build-button"
								onClick={this.add.bind(this)}>
								+
							</button>
						</>
					}
					{
						this.state.data.map(data =>
							<GivenStep
								onChange={this.onChange}
								data={data.stepResult}
								key={data.index}
							/>)
						// this.preconditions.map((_, i) => GivenStep(i))
						// 	.map(X => <X {...this.props} />)
					}
				</div>
			)
		}

	}
	// return <GivenSteps />;
}

