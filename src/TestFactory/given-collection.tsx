import { globalStepNavigator, globalBoard } from '../dependency-container';
import * as React from 'react'
import { TestStepOptions } from './test-step-recorder';
import { TestStepTurn } from "./test-step-turn";
import { Step } from "./board-data-mapper";
import { useWhatChanged } from "@simbathesailor/use-what-changed";
import { GivenStep } from './given-step';


export type IndexedStep = {
	index: number
	step: Step
}
export type GivenStepsProps = {
	// eslint-disable-next-line no-unused-vars
	onStepSelectionChange: (stepResults: IndexedStep[]) => void
	steps?: IndexedStep[]
}
function createGivenStepCollection(options: TestStepOptions) {
	return function GivenStepCollection(props: GivenStepsProps) {

		const [isActive, setIsActive] = React.useState<boolean>(false)
		const [indexedSteps, setIndexedSteps] = React.useState<IndexedStep[]>([])
		// const [state, setState] = React.useState<State>({
		// 	isActive: false,
		// 	indexedSteps: []
		// })

		React.useEffect(() => {
			options.stepNavigator.onTurn(TestStepTurn.Given, () => {
				setIsActive(true)
				if (props.steps)
					setIndexedSteps(props.steps)
			})
		})
		useWhatChanged([indexedSteps])


		let nextId: number = 1
		const add = () => {
			// const data = indexedSteps;
			// data.unshift({ index: nextId } as IndexedStep)
			setIndexedSteps([{ index: nextId } as IndexedStep, ...indexedSteps])
			nextId++;
		}
		const onStepSelection = (updatedStep: Step) => {
			// function replace<T>(arr: Array<T>, newItem: T, predicate: (old: T) => Boolean) {
			// }
			const replaceOldIfEqual = (oldStep: IndexedStep, updatedStep: Step) => {

				const oldEqualsNew: boolean = oldStep.step == undefined
					|| oldStep.step.metadata.widget.id === updatedStep.metadata.widget.id

				return oldEqualsNew
					? { step: updatedStep, index: oldStep.index } as IndexedStep
					: oldStep
			}

			const updatedSteps = indexedSteps.map(oldStep => replaceOldIfEqual(oldStep, updatedStep))

			setIndexedSteps([...updatedSteps])

			props.onStepSelectionChange(updatedSteps)
			console.log("onChange:", updatedSteps)
		}
		return (
			<div>
				<h1>Given({indexedSteps.length})</h1>

				{isActive &&
					<>
						{/* <h3>{options.selectionWaitingMessage}</h3> */}
						<button className="add-step-button"
							onClick={add}>
							+ Given
							</button>
					</>
				}
				{
					indexedSteps.map(data =>
						<GivenStep
							onStepSelection={onStepSelection}
							step={data.step}
							key={data.index}
						/>)
				}


			</div>)

	}
}

export const Givens = createGivenStepCollection({
	board: globalBoard,
	stepNavigator: globalStepNavigator,
	stepType: TestStepTurn.Given,
	selectionWaitingMessage: 'Select minimum required steps for the when to end up then.',
	turn: TestStepTurn.Given,
})