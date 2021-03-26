/* eslint-disable no-undef */
import * as React from 'react';
import { ViewModel } from '../test-factory/test-recorder';
import "./test-explorer.css"
import {TestExplorerItem}from'./test-explorer-item'


export const TestExplorer = (props): JSX.Element => {

    const getAllTests = async (testContext: string) => {
        const response = await fetch(`https://localhost:6001/Tests/all/${testContext}`,
            {
                headers: { 'Content-Type': 'application/json' },
                method: 'GET',
            });

        console.log(response.body)
        if (response.ok) {
            console.log(JSON.stringify(await response.json()));
            // var xxx = (await response.json()).Tests.map(x => {
            //     return {
            //         testName: x.test.testName,
            //         testContext: "SampleService",
            //         sutName: x.test.sut,
            //         givens: x.test.given.map((step, i) => {
            //             return {
            //                 type: step.type,
            //                 widget: JSON.parse(x.Metadata).given[i]
            //             }
            //         }) as StepInfo[]
            //         when: {
            //             type: x.test.
            //         }
            //         // then: Step
            //     }
            // })
        }
        else {
            console.log(response)
        }
    }

    // getAllTests('SampleService')

    // eslint-disable-next-line react/prop-types
    if (!props.location.state?.newTest)
        return <div>No Tests</div >
    // eslint-disable-next-line react/prop-types
    const viewModel = props.location.state.newTest as ViewModel
    // eslint-disable-next-line react/prop-types
    console.log('typeof props from test-explorer.tsx', typeof props)

    const tests = [viewModel]

    return <>
        {tests.map(vm => <TestExplorerItem key={vm.testName} viewModel={vm} />)}
    </>

}
