import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Navigate } from "react-router-dom"
import { ExternalServices } from '../external-services'
import { Sidebar } from "./side-bar/sidebar"

const app = <div style={{ display: 'flex' }}>
    <Sidebar />
    <ExternalServices.boardUi />
</div>

// const app = <div>Hello</div>

ReactDOM.render(app, document.getElementById('react-app'))

Navigate({to:'/'})