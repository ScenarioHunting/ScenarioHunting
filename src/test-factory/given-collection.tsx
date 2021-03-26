import './given-collection.module.css'
import { singletonStepNavigator } from './local-dependency-container';
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
	(stepNavigator = singletonStepNavigator) =>
		(props: GivenStepsProps) => {

			const [canAdd, setCanAdd] = React.useState<boolean>(false)
			const [isActive, setIsActive] = React.useState<boolean>(false)
			const [indexedSteps, setIndexedSteps] = React.useState<IndexedStep[]>([])

			React.useEffect(() => {
				stepNavigator.onTurn(TestStepTurn.Given, () => {
					setIsActive(true)
					setCanAdd(true)
					if (props.steps)
						setIndexedSteps(props.steps)
				})
			}, [props.steps])
			useWhatChanged([indexedSteps])


			let nextId: number = 1
			const add = () => {
				if (!canAdd || indexedSteps.length > 9)
					return;
				// const data = indexedSteps;
				// data.unshift({ index: nextId } as IndexedStep)
				setIndexedSteps([{ index: nextId } as IndexedStep, ...indexedSteps])
				nextId++;

				setCanAdd(false)
				console.log("add: can add=", canAdd)
			}

			const onStepSelection = (updatedStep: SelectedWidget) => {
				setCanAdd(true)
				console.log("on next selection: can add=", canAdd)

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
			}
			return (
				<div>
					{/* <h3 style={{ color: isActive ? 'inherit' : '#c3c2cf' }}>Given({indexedSteps.length})</h3>
					<button
						style={{ display: isActive ? 'block' : 'none' }}
						className="add-step-button miro-btn miro-btn--small miro-btn--secondary"
						disabled={!isActive || !canAdd || indexedSteps.length > 9}
						onClick={add}>
						+ Given
					</button> */}
					<button onClick={add}
						className="image-button miro-btn miro-btn--secondary miro-btn--small"
						style={{ display: "flex", padding: '0px', width: '94px' }}
						disabled={!isActive || !canAdd || indexedSteps.length > 9}>
						<svg style={{ flex: '0 0 20px' }} width="20px" viewBox="0 0 24 24">
							<path d="M1.7,8.2l4.9,3.5L0.3,18c-0.4,0.4-0.4,1,0,1.4l4.2,4.2c0.4,0.4,1,0.4,1.4,0l6.4-6.4l3.5,5L24,0L1.7,8.2z M15.1,17.3L12.8,14  l-7.5,7.5l-2.8-2.8l7.5-7.5L6.7,8.9l13.6-5.1L15.1,17.3z" ></path>
						</svg>
						<h3 style={{ margin: '0px', flex: '0 0 auto', marginTop: '10px' }}>
							Given({indexedSteps.length})
						</h3>
					</button>

					{
						indexedSteps.map(data =>
							<GivenStep
								onStepSelection={onStepSelection}
								step={data.step}
								key={data.index}
							/>)
					}
					{indexedSteps.length > 9 &&
						<div className="status-text">More than 10 givens are not allowed</div>
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