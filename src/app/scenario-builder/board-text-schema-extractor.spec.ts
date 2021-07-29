/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
const should = require('chai').should()
import { ArrayProperty, SingularProperty } from "../api";
import { extractStepFromText } from "./board-text-schema-extractor";
// import { extractStepFromText } from "./board-text-step-extractor";

describe('how the step becomes extracted from text', function () {
    it('extracts the first line as title', async function () {
        const step = await extractStepFromText({
            schemaText: `title`,
            dataText: `title`
        });
        step.schema.title.should.eq('title')
    })
    it('extracts second line as property', async function name() {
        const step = await extractStepFromText({
            schemaText: `person`,
            dataText: `person
            first_name: Mohsen`
        });
        (step.schema.properties.first_name as SingularProperty).example.should.eq('Mohsen')
    })
    it('removes the dash as the first char of property names', async () => {
        const step = await extractStepFromText({
            schemaText: `person`,
            dataText: `person
                        -first_name: Mohsen
                        -   last_name:Bazmi`
        });

        (step.schema.properties.first_name as SingularProperty).example.should.eq('Mohsen');
        (step.schema.properties["last_name"] as SingularProperty).example.should.eq('Bazmi');
    })
    it('skips white spaces and empty lines', async () => {
        const step = await extractStepFromText({
            schemaText: `
            
                                person
            
            
            
            `,
            dataText: `
            
            
                              person



                         first_name: Mohsen
             
                         
                         last_name:Bazmi


                        `
        });

        (step.schema.properties.first_name as SingularProperty).example.should.eq('Mohsen');
        (step.schema.properties.last_name as SingularProperty).example.should.eq('Bazmi')
    })
    it('copies property titles as property values when no property value is provided', async () => {
        const step = await extractStepFromText({
            schemaText: `person`,
            dataText: `person
                              first_name
                              last_name`
        });

        (step.schema.properties.first_name as SingularProperty).example.should.eq('first_name');
        (step.schema.properties.last_name as SingularProperty).example.should.eq('last_name');

    })
    it('separates properties by ;', async () => {
        const step = await extractStepFromText({
            schemaText: `person`,
            dataText: `person
                  first name: Mohsen;last name: Bazmi
            `
        });
        (step.schema.properties["first name"] as SingularProperty).example.should.eq('Mohsen')
    })
    it('separates properties by ,', async () => {
        const step = await extractStepFromText({
            schemaText: `person`,
            dataText: `person
                            first_name: Mohsen,last name: Bazmi`
        });
        (step.schema.properties.first_name as SingularProperty).example.should.eq('Mohsen')
    })
    it('separates properties by /', async () => {
        const step = await extractStepFromText({
            schemaText: `person`,
            dataText: `person
                            first_name: Mohsen/last name: Bazmi`
        });
        (step.schema.properties.first_name as SingularProperty).example.should.eq('Mohsen')
    })
    it('rejects when the title is not in abstraction widget or example widget', async () => {
        extractStepFromText({
            schemaText: ``,
            dataText: `first name: Mohsen/last name: Bazmi`
        }).catch(err => err.should.not.be.null)
    })
    it('skips white spaces from abstraction title', async () => {
        const step = await extractStepFromText({
            schemaText: `                person                 `,
            dataText: ``
        });
        step.schema.title.should.eq('person')
    })
    // it('it replaces spaces in property names with _', async () => {
    //     const step = await extractStepstep({
    //         abstractionWidgetText: `person`,
    //         exampleWidgetText: `person
    //                         first name is separated by space`
    //     })
    //     step.schema.properties.first_name_is_separated_by_space.should.not.undefined
    // })
    // it('it replaces - in property names with _', async () => {
    //     const step = await extractStepstep({
    //         abstractionWidgetText: `person`,
    //         exampleWidgetText: `person
    //                         first-name-is-separated-by-dash`
    //     })
    //     step.schema.properties.first_name_is_separated_by_dash.should.not.undefined
    // })
    // it('it replaces redundant _s in property names with  a single_', async () => {
    //     const step = await extractStepstep({
    //         abstractionWidgetText: `person`,
    //         exampleWidgetText: `person
    //                         first__name_____is__________separated___by_redundant_underlines`
    //     })
    //     step.schema.properties.first_name_is_separated_by_redundant_underlines.should.not.undefined
    // })
    xit('it splits camel case phrases in property names by _', async () => {
        const step = await extractStepFromText({
            schemaText: `person`,
            dataText: `person
                               firstName`
        });
        (step.schema.properties.first_name as SingularProperty).should.not.undefined
    })
    it('it does not change property names with words that are separated by _ already', async () => {
        const step = await extractStepFromText({
            schemaText: `person`,
            dataText: `person
                            first_name_is_separated_by_underline`
        });
        (step.schema.properties.first_name_is_separated_by_underline as SingularProperty).should.not.undefined
    })
    // it('it de-capitalizes title',async ()=>{
    //     const step = await extractStepstep({
    //         abstractionWidgetText: `De_Capitalize_Me`,
    //         exampleWidgetText: `De_Capitalize_Me
    //                         first_name_is_separated_by_underline`
    //     })
    //     step.schema.title.should.eq('de_capitalize_me')
    // })
    it('detects [items in brackets] as arrays', async () => {
        const step = await extractStepFromText({
            schemaText: `Add Items to Basket`,
            dataText: `Add Items to Basket

            Customer Id
            
            Items:[product id,
            
            amount]`
        });
        (step.schema.properties.Items as ArrayProperty).type.should.eq('array')
    })

    it('detects the properties of the internal array', async () => {

        const actual = await extractStepFromText({
            schemaText: `Add Items to Basket`,
            dataText: `Add Items to Basket

            Customer Id
            
            array_sample:[
                product_id:val,
            
            amount],
            root_property`
        });

        const expected = {
            type: "array",
            description: "array_sample",
            items: [
                {
                    type: "string",
                    description: "product_id",
                    example: "val"
                },
                {
                    type: "string",
                    description: "amount",
                    example: "amount"
                } as SingularProperty
            ]
        } as ArrayProperty;
        actual.schema.properties.array_sample.should.deep.equal(expected);
    })
    it('detects number type for digits', async () => {
        const step = await extractStepFromText({
            schemaText: `person`,
            dataText: `person
                               age:23`
        });
        const expected = {
            type: "number",
            description: "age",
            example: 23
        } as SingularProperty
        step.schema.properties.age.should.deep.equal(expected)
    })
    it('detects boolean type for true or false', async () => {
        const step = await extractStepFromText({
            schemaText: `person`,
            dataText: `person
                               isMarried:True
                               isMale:fAlSe`
        });

        const expectedIsMarried = {
            type: "boolean",
            description: "isMarried",
            example: true
        } as SingularProperty
        step.schema.properties.isMarried.should.deep.equal(expectedIsMarried)

        const expectedIsMale = {
            type: "boolean",
            description: "isMale",
            example: false
        } as SingularProperty
        step.schema.properties.isMale.should.deep.equal(expectedIsMale)
    })
    it('skips the initial empty line before the extraction',async()=>{
        const step = await extractStepFromText({
            schemaText: `
            person`,
            dataText: `
            person`
        });
        step.schema.title.should.eq(`person`)
        step.schema.properties.should.empty
    })

})