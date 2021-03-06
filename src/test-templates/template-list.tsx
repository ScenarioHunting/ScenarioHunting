/* eslint-disable no-undef */
import * as React from 'react';
import "./template-list.less"
import { getTemplateRepository } from '../test-factory/template-repository';
import { useState, useEffect } from "react";

export const TemplateList = (props): JSX.Element => {


    const [templateNames, setAvailableTemplateNames] = useState<string[]>([]);
    useEffect(() => {
        getTemplateRepository().then(repo => {
            repo.getAllTemplateNames().then(x => {
                setAvailableTemplateNames(x)
            }).catch(e => { throw e })
        })
    }, []);
    function editTemplate(templateName: string) {
        miro.board.ui.openModal('monaco-editor.html', { fullscreen: true })
    }
    return <>
        {templateNames.map(templateName =>
            <button key={templateName} onClick={() => editTemplate(templateName)} > templateName</button>)
        }
    </>

}
