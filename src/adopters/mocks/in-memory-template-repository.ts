import { iTemplateRepository, textTemplate } from '../../app/ports/itemplate-repository';
function localStorageAllItems() {

    var values: string[] = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    while (i--) {
        const key = keys[i]
        const item = localStorage.getItem(key)
        if (item != null)
            values.push(item);

    }

    return values;
}

function localStorageAllKeys() {
    return Object.keys(localStorage)
}

export class localStorageTemplateRepository implements iTemplateRepository {

    createOrReplaceTemplate(originalTemplateName: string, newTemplate: textTemplate) {
        localStorage.setItem(originalTemplateName, JSON.stringify(newTemplate))
    }
    getAllTemplateNames(): Promise<string[]> {
        return Promise.resolve(localStorageAllKeys())
    }
    removeTemplate(templateName: string) {
        localStorage.removeItem(templateName)
    }
    getTemplateByName(templateName: string): Promise<textTemplate> {
        const item = localStorage.getItem(templateName)
        if (!item)
            return Promise.reject("Template not found!")
        return Promise.resolve((<textTemplate>JSON.parse(item)))
    }
}
