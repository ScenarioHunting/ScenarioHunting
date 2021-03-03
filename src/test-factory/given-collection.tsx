// import { singletonStepNavigator } from './local-dependency-container';
import * as React from 'react'
import { TestStepTurn } from "./test-step-turn";
import { useWhatChanged } from "@simbathesailor/use-what-changed";
import { GivenStep } from './given-step';
import { SelectedWidget } from 'board';


export type IndexedStep = {
	index: number
	step: SelectedWidget
}
export type GivenStepsProps = {
	// eslint-disable-next-line no-unused-vars
	onStepSelectionChange: (stepResults: IndexedStep[]) => void
	steps?: IndexedStep[]
}
export let createGivenStepCollection =
	() =>
	// (stepNavigator = singletonStepNavigator) =>
		(props: GivenStepsProps) => {

			const [isActive, setIsActive] = React.useState<boolean>(false)
			const [indexedSteps, setIndexedSteps] = React.useState<IndexedStep[]>([])
			// const [state, setState] = React.useState<State>({
			// 	isActive: false,
			// 	indexedSteps: []
			// })

			// React.useEffect(() => {
			// 	stepNavigator.onTurn(TestStepTurn.Given, () => {
			// 		setIsActive(true)
			// 		if (props.steps)
			// 			setIndexedSteps(props.steps)
			// 	})
			// })
			// useWhatChanged([indexedSteps])


			let nextId: number = 1
			const add = () => {
				// const data = indexedSteps;
				// data.unshift({ index: nextId } as IndexedStep)
				setIndexedSteps([{ index: nextId } as IndexedStep, ...indexedSteps])
				nextId++;
			}
			const onStepSelection = (updatedStep: SelectedWidget) => {
				// function replace<T>(arr: Array<T>, newItem: T, predicate: (old: T) => Boolean) {
				// }
				const replaceOldIfEqual = (oldStep: IndexedStep, updatedStep: SelectedWidget) => {

					const oldEqualsNew: boolean = oldStep.step == undefined
						|| oldStep.step.widgetSnapshot.id === updatedStep.widgetSnapshot.id

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


export const Givens = createGivenStepCollection()
// export const Givens = createGivenStepCollection({
// 	board: singletonBoard,
// 	stepNavigator: singletonStepNavigator,
// 	stepType: TestStepTurn.Given,
// 	selectionWaitingMessage: 'Select minimum required steps for the when to end up then.',
// 	turn: TestStepTurn.Given,
// })