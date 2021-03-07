import * as React from 'react';
import "./template-list.less"
import { getTemplateRepository } from '../test-factory/template-repository';
import { useState, useEffect } from "react";

export const TemplateList = (props): JSX.Element => {


    const [templateNames, setAvailableTemplateNames] = useState<string[]>([]);
    useEffect(() => {
        getTemplateRepository().then(repo => {
            repo.getAllTemplateNames().then(templateNames => {
                setAvailableTemplateNames(templateNames)
            }).catch(e => { throw e })
        })
    }, []);
    function editTemplate(templateName: string) {
        console.log(templateName)
        // eslint-disable-next-line no-undef
        miro.board.ui.openModal('./monaco-editor.html', { fullscreen: false })
    }
    function deleteTemplate(templateName: string) {
        console.log(templateName)
        //confirm
        //delete
    }
    return <>
        {templateNames.map(templateName =>
            <div className="raw" key={templateName}>
                <p onClick={() => editTemplate(templateName)} className="templateName" >
                    {templateName}
                </p>
                <button onClick={() => deleteTemplate(templateName)} className="imageButton">
                    <img alt="Delete" src="https://cdn1.iconfinder.com/data/icons/free-education-set/32/trash-512.png"
                        className="imageInButton" />
                </button>
                {/* <button onClick={() => editTemplate(templateName)} > Edit</button>
                <button onClick={() => deleteTemplate(templateName)} > Delete</button> */}
            </div>
        )}
    </>

}
