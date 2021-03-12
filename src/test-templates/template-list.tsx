import * as React from 'react';
import "./template-list.less"
import { getTemplateRepository } from '../test-factory/template-repository';
import { useState, useEffect } from "react";

export function TemplateList(props): JSX.Element {


    const [templateNames, setAvailableTemplateNames] = useState<string[]>([]);
    function loadTemplateNames() {
        getTemplateRepository().then(repo => {
            repo.getAllTemplateNames().then(templateNames => {
                setAvailableTemplateNames(templateNames)
            }).catch(e => { throw e })
        })
    }
    useEffect(loadTemplateNames, []);
    function addTemplate() {
        miro.board.ui.openModal(`./monaco-editor.html`, { fullscreen: false })
    }

    function editTemplate(templateName: string) {
        console.log(templateName)
        // eslint-disable-next-line no-undef
        getTemplateRepository()
            .then(repository => {
                // console.log(`All Template Names:`, repository.getAllTemplateNames())

                repository.getTemplateByName(templateName).then(template => {
                    console.log(`Template: ${template} is here:`, template)
                    const queryString = `?templateName=${templateName}&templateContent=${JSON.stringify(template)}&templateContentObj=${template}`
                    miro.board.ui.openModal(`./monaco-editor.html${queryString}`, { fullscreen: false })
                })
            })
        // miro.board.ui.openModal(`./monaco-editor.html?templateName=${templateName}`, { fullscreen: false })
    }
    function deleteTemplate(templateName: string) {
        if (!confirm(`You are about deleting the template: ${templateName}.\n Are you sure?`))
            return;
        getTemplateRepository()
            .then(repository => {
                repository.removeTemplate(templateName)
                setAvailableTemplateNames(templateNames.filter(t => t != templateName))
                console.log("Template: " + templateName + " deleted.")
            })
    }
    return <>
        <div className="raw" style={{ paddingBottom: "18px" }}>

            <p className="templateName"></p>

            <button onClick={addTemplate} className="imageButton">
                <svg fill="currentColor" fillRule="nonzero" className="imageButton" viewBox="0 0 48 48">
                    <g>
                        <path d="M37,43c0,0.6-0.4,1-1,1H12c-0.6,0-1-0.4-1-1V5c0-0.6,0.4-1,1-1h13V2H12c-1.7,0-3,1.3-3,3v38c0,1.7,1.3,3,3,3h24   c1.7,0,3-1.3,3-3V16h-2V43z"></path>
                        <polygon points="33,8 33,2 31,2 31,8 25,8 25,10 31,10 31,16 33,16 33,10 39,10 39,8  "></polygon>
                        <rect height="2" width="10" x="17" y="19"></rect>
                        <rect height="2" width="14" x="17" y="27"></rect>
                        <rect height="2" width="10" x="17" y="35"></rect>
                    </g>
                </svg>
            </button>

        </div>
        {/* <button className="imageButton" style={{ height: "28px" }}>
            <svg className="imageButton" viewBox="0 0 48 48">
                <g>
                    <path d="M37,43c0,0.6-0.4,1-1,1H12c-0.6,0-1-0.4-1-1V5c0-0.6,0.4-1,1-1h13V2H12c-1.7,0-3,1.3-3,3v38c0,1.7,1.3,3,3,3h24   c1.7,0,3-1.3,3-3V16h-2V43z">
                    </path>
                    <polygon points="33,8 33,2 31,2 31,8 25,8 25,10 31,10 31,16 33,16 33,10 39,10 39,8  ">
                    </polygon>
                    <rect height="2" width="10" x="17" y="19">
                    </rect>
                    <rect height="2" width="14" x="17" y="27">
                    </rect>
                    <rect height="2" width="10" x="17" y="35">
                    </rect>
                </g>
            </svg>
        </button> */}
        {templateNames.map(templateName =>
            <div className="raw" key={templateName}>
                <p onClick={() => editTemplate(templateName)} className="templateName" >
                    {templateName}
                </p>
                <button onClick={() => deleteTemplate(templateName)} className="imageButton">
                    <svg fill="currentColor" fillRule="nonzero" className="imageButton" viewBox="0 0 25.833 31.716">
                        <g transform="translate(-355.957 -579)">
                            <path d="M376.515,610.716H361.231a2.361,2.361,0,0,1-2.358-2.359V584.1a1,1,0,0,1,2,0v24.255a.36.36,0,0,0,.358.359h15.284a.36.36,0,0,0,.358-.359V584.1a1,1,0,0,1,2,0v24.255A2.361,2.361,0,0,1,376.515,610.716Z"></path><path d="M365.457,604.917a1,1,0,0,1-1-1v-14a1,1,0,0,1,2,0v14A1,1,0,0,1,365.457,604.917Z"></path><path d="M372.29,604.917a1,1,0,0,1-1-1v-14a1,1,0,0,1,2,0v14A1,1,0,0,1,372.29,604.917Z"></path><path d="M380.79,585.1H356.957a1,1,0,0,1,0-2H380.79a1,1,0,0,1,0,2Z"></path><path d="M372.79,581h-7.917a1,1,0,1,1,0-2h7.917a1,1,0,0,1,0,2Z">
                            </path>
                        </g>
                    </svg>
                    {/* <img alt="Delete" src="https://cdn1.iconfinder.com/data/icons/free-education-set/32/trash-512.png"
                        className="imageInButton" /> */}
                </button>
                {/* <button onClick={() => editTemplate(templateName)} > Edit</button>
                <button onClick={() => deleteTemplate(templateName)} > Delete</button> */}
            </div>
        )}

    </>

}
