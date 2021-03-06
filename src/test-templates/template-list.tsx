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
        miro.board.ui.openModal('./monaco-editor.html', { fullscreen: true })
    }
    function deleteTemplate(templateName: string) {
        console.log(templateName)
        //confirm
        //delete
    }
    return <>
        {templateNames.map(templateName =>
            <div key={templateName}>
                { templateName }
                <button onClick={() => editTemplate(templateName)} > Edit</button>
                <button onClick={() => deleteTemplate(templateName)} > Delete</button>
            </div>
        )}
    </>

}
