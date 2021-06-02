/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
const should = require('chai').should()
import { stringCaseHelpers } from "./string-case-helpers"

describe('string case helpers', function () {
    it('camelCases snake_case strings', () =>
        stringCaseHelpers.camelCase('originally_snake_case_string')
            .should.eq('originallySnakeCaseString')
    )
    it('PascalCases snake_case strings', () =>
        stringCaseHelpers.pascalCase('originally_snake_case_string')
            .should.eq('OriginallySnakeCaseString')
    )

    it('kebab-cases snake_case strings', () =>

        stringCaseHelpers.kebabCase('originally_snake_case_string')

            .should.eq('originally-snake-case-string')
    )
    it('space cases snake_case strings', () =>

        stringCaseHelpers.spaceCase('originally_snake_case_string')

            .should.eq('originally snake case string')
    )
    it('capitalizes the first letter', () =>

        stringCaseHelpers.capitalize('the first letter was originally small')

            .should.eq('The first letter was originally small')
    )
    it('snakeCase replaces spaces with _', () =>
        stringCaseHelpers.snakeCase(`separated by       space`)
            .should.eq("separated_by_space")
    )
    it('snakeCase replaces - with _', () =>
        stringCaseHelpers.snakeCase(`the-string-you-see-here`)
            .should.eq(`the_string_you_see_here`)
    )
    it('snakeCase replaces multiple trailing __ with a single _', () =>
        stringCaseHelpers.snakeCase(`first__name_____is__________separated___by_redundant_underlines`)
            .should.eq("first_name_is_separated_by_redundant_underlines")
    )
    
    it('snake_cases the PascalCase', () =>
        stringCaseHelpers.snakeCase('I 0 Am A Guy 1')
            .should.eq('i_0_am_a_guy_1')
    )
    it('it de-capitalizes title', () =>
        stringCaseHelpers.snakeCase(`DE_Capitalize_ME`)
            .should.eq('de_capitalize_me')
    )
    it('returns empty string for null')
    it('returns empty string for undefined')
})