import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ExternalServices } from '../external-services'
import { Sidebar } from "./side-bar/sidebar"
import { createRoot } from 'react-dom/client';



const App =()=> <div style={{ display: 'flex' }}>
    <Sidebar />
    <ExternalServices.boardUi />
</div>
const root = createRoot(document.getElementById('react-app')!)
root.render(<App/>)
