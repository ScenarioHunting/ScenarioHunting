import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { navigate } from "@reach/router"
import { BoardUi } from "../board-mock";
import { Sidebar } from "./side-bar/sidebar"

const app = <div style={{ display: 'flex' }}>
    <Sidebar />
    {/* <BoardUi /> */}
</div>

ReactDOM.render(app, document.getElementById('react-app'))


navigate('/')