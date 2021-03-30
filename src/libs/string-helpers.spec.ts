/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
const should = require('chai').should()
import { stringHelpers } from "./string-helpers"

describe('string helpers', function () {
    it('camelCases sneak_case strings', () =>

        stringHelpers.sneakToCamelCase('originally_sneak_case_string')

            .should.eq('originallySneakCaseString')
    )
    it('PascalCases sneak_case strings', () =>

        stringHelpers.sneakToPascalCase('originally_sneak_case_string')

            .should.eq('OriginallySneakCaseString')
    )
    it('kebab-cases sneak_case strings', () =>

        stringHelpers.sneakToKebabCase('originally_sneak_case_string')

            .should.eq('originally-sneak-case-string')
    )
    it('space cases sneak_case strings', () =>

        stringHelpers.sneakToSpaceCase('originally_sneak_case_string')

            .should.eq('originally sneak case string')
    )
    it('capitalizes the first letter', () =>

        stringHelpers.capitalize('the first letter was originally small')

            .should.eq('The first letter was originally small')
    )
    it('converts objects to json', () => {

        stringHelpers.json({ some: 'object' })

            .should.eq(`{"some":"object"}`)
    })
})