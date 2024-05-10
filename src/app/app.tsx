import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ExternalServices } from '../external-services'
import { Sidebar } from "./side-bar/sidebar"

const app = <div style={{ display: 'flex' }}>
    <Sidebar />
    <ExternalServices.boardUi />
</div>
miro.board.setAppData("TESTT",{value:"works"})
.then(async()=> console.log("TESTT",Object.keys(await miro.board.getAppData())))
ReactDOM.render(app, document.getElementById('react-app'))
