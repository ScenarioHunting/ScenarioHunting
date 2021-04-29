/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
const should = require('chai').should()
import { stringCaseHelpers } from "./string-case-helpers"

describe('string case helpers', function () {
    it('camelCases sneak_case strings', () =>

        stringCaseHelpers.sneakToCamelCase('originally_sneak_case_string')

            .should.eq('originallySneakCaseString')
    )
    it('PascalCases sneak_case strings', () =>

        stringCaseHelpers.sneakToPascalCase('originally_sneak_case_string')

            .should.eq('OriginallySneakCaseString')
    )
    it('kebab-cases sneak_case strings', () =>

        stringCaseHelpers.sneakToKebabCase('originally_sneak_case_string')

            .should.eq('originally-sneak-case-string')
    )
    it('space cases sneak_case strings', () =>

        stringCaseHelpers.sneakToSpaceCase('originally_sneak_case_string')

            .should.eq('originally sneak case string')
    )
    it('capitalizes the first letter', () =>

        stringCaseHelpers.capitalize('the first letter was originally small')

            .should.eq('The first letter was originally small')
    )
    it('returns empty string for null')
    it('returns empty string for undefined')
})