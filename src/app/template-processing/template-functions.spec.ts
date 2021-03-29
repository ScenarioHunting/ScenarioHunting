/* eslint-disable no-undef */

import { templateFunctions } from "./template-functions"

// eslint-disable-next-line no-unused-vars
const should = require('chai').should()

describe('functions available in templates', function () {
    it('camelCases sneak_case strings', () =>

        templateFunctions.camelCase('originally_sneak_case_string')

            .should.eq('originallySneakCaseString')
    )
    it('PascalCases sneak_case strings', () =>

        templateFunctions.pascalCase('originally_sneak_case_string')

            .should.eq('OriginallySneakCaseString')
    )
    it('kebab-cases sneak_case strings', () =>

        templateFunctions.kebabCase('originally_sneak_case_string')

            .should.eq('originally-sneak-case-string')
    )
    it('space cases sneak_case strings', () =>

        templateFunctions.spaceCase('originally_sneak_case_string')

            .should.eq('originally sneak case string')
    )
    it('capitalizes the first letter', () =>

        templateFunctions.capitalize('the first letter was originally small')

            .should.eq('The first letter was originally small')
    )
})