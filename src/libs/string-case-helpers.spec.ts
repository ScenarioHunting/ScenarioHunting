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

    it('toSnakeCase replaces spaces with _', () =>
        stringCaseHelpers.toSnakeCase(`separated by       space`)
            .should.eq("separated_by_space")
    )
    it('toSnakeCase replaces - with _', () =>
        stringCaseHelpers.toSnakeCase(`first-name-is-separated-by-dash`)

            .should.eq("first_name_is_separated_by_dash")
    )
    it('toSnakeCase replaces multiple trailing __ with a single _', () =>
        stringCaseHelpers.toSnakeCase(`first__name_____is__________separated___by_redundant_underlines`)
            .should.eq("first_name_is_separated_by_redundant_underlines")
    )
    it('it de-capitalizes title', () =>
        stringCaseHelpers.toSnakeCase(`DE_Capitalize_ME`)
            .should.eq('de_capitalize_me')
    )
})