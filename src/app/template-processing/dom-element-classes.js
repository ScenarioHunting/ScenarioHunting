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
    }
}