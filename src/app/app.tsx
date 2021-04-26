import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { navigate } from "@reach/router"
import { ExternalServices } from '../external-services'
import { Sidebar } from "./side-bar/sidebar"

const app = <div style={{ display: 'flex' }}>
    <Sidebar />
    <ExternalServices.boardUi />
</div>

ReactDOM.render(app, document.getElementById('react-app'))


navigate('/')