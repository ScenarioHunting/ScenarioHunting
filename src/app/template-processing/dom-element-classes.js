export const domElementClasses = {
    changePrefixesByPostfix(
        {
            elements,
            classPostfix,
            oldClassPrefix,
            newClassPrefix
        }) {
        const getClassName = (prefix, postfix) => `${prefix}-${postfix}`;

        const oldClassName = getClassName(oldClassPrefix, classPostfix)
            , newClassName = getClassName(newClassPrefix, classPostfix);

        for (var i = elements.length - 1; i > -1; i--) {
            const element = elements[i];

            element.classList.remove(oldClassName)
            element.classList.add(newClassName)

        }
    },
    changePrefixesByPostfix2(
        {
            classPostfix,
            oldClassPrefix,
            newClassPrefix
        }) {
        const getClassName = (prefix, postfix) => `${prefix}-${postfix}`;
        var elements = document.getElementsByClassName(getClassName(oldClassPrefix + '-' + classPostfix))
        if (!elements.length)
            elements = document.getElementsByClassName(getClassName(newClassPrefix + '-' + classPostfix))

        const oldClassName = getClassName(oldClassPrefix, classPostfix)
            , newClassName = getClassName(newClassPrefix, classPostfix);

        for (var i = elements.length - 1; i > -1; i--) {
            const element = elements[i];

            element.classList.remove(oldClassName)
            element.classList.add(newClassName)
        }
    },
    switchMode(
        {
            oldClassPrefix,
            newClassPrefix
        }) {

        var elements = document.querySelectorAll(`[class*='${oldClassPrefix}']`)
        if (!elements.length)
            elements = document.querySelectorAll(`[class*='${newClassPrefix}']`)

        domElementClasses.changePrefixesByPostfix2({
            oldClassPrefix,
            newClassPrefix
        })

        for (var i = elements.length - 1; i > -1; i--) {
            const element = elements[i];

            element.classList.forEach(cl => {
                if (cl.startsWith(`${newClassPrefix}-`))
                    return;

                if (cl.startsWith(`${oldClassPrefix}-`)) {
                    const classPostfix = cl.split('-').slice(-1).join()
                    element.classList.remove(cl)
                    element.classList.add(`${newClassPrefix}-` + classPostfix)
                }
            })
        }
    }
}