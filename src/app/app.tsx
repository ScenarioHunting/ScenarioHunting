import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { navigate } from "@reach/router"
import { BoardUi } from "../adopters/mocks/board-mock"
import { Sidebar } from "./side-bar/sidebar"

const app = <div style={{ display: 'flex' }}>
    <Sidebar />


    <BoardUi />

    <div id="popup" style={{
        display: 'none',
        position: 'fixed',
        top: '12%',
        left: '15%',
        width: '70%',
        height: '70%',
        backgroundColor: 'white',
        zIndex: 10
    }}>
        <iframe id="popupiframe" style={{
            width: '100%',
            height: '100%',
            border: 0
        }}>
        </iframe>
    </div>
    <div id="popupdarkbg" style={{
        position: 'fixed',
        zIndex: 5,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,.75)',
        display: 'none'
    }}></div>
</div>

ReactDOM.render(app, document.getElementById('react-app'))


navigate('/')