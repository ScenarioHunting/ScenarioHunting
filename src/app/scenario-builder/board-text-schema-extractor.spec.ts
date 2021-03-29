/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
const should = require('chai').should()
import { extractStepSchema } from "./board-text-schema-extractor";

describe('how the schema becomes extracted from text', function () {
    it('extracts the first line as title', async function () {
        const schema = await extractStepSchema({
            abstractionWidgetText: `title`,
            exampleWidgetText: `title`
        })
        schema.title.should.eq('title')
    })
    it('extracts second line as property', async function name() {
        const schema = await extractStepSchema({
            abstractionWidgetText: `person`,
            exampleWidgetText: `person
            first name: Mohsen`
        })
        schema.properties.first_name.example.should.eq('Mohsen')
    })
    it('removes the dash as the first char of property names', async () => {
        const schema = await extractStepSchema({
            abstractionWidgetText: `person`,
            exampleWidgetText: `person
                        -first name: Mohsen
                        -   last name:Bazmi`
        })

        schema.properties.first_name.example.should.eq('Mohsen')
        schema.properties.last_name.example.should.eq('Bazmi')
    })
    it('skips white spaces and empty lines', async () => {
        const schema = await extractStepSchema({
            abstractionWidgetText: `
            
                                person
            
            
            
            `,
            exampleWidgetText: `
            
            
                              person



                         first name: Mohsen
             
                         
                         last name:Bazmi


                        `
        })

        schema.properties.first_name.example.should.eq('Mohsen')
        schema.properties.last_name.example.should.eq('Bazmi')
    })
    it('replaces property values with property titles when no property value is provided', async () => {
        const schema = await extractStepSchema({
            abstractionWidgetText: `person`,
            exampleWidgetText: `person
                              first name
                              last name`
        })

        schema.properties.first_name.example.should.eq('first name')
        schema.properties.last_name.example.should.eq('last name')

    })
    it('separates properties by ;', async () => {
        const schema = await extractStepSchema({
            abstractionWidgetText: `person`,
            exampleWidgetText: `person
                  first name: Mohsen;last name: Bazmi
            `
        })
        schema.properties.first_name.example.should.eq('Mohsen')
    })
    it('separates properties by ,', async () => {
        const schema = await extractStepSchema({
            abstractionWidgetText: `person`,
            exampleWidgetText: `person
                            first name: Mohsen,last name: Bazmi`
        })
        schema.properties.first_name.example.should.eq('Mohsen')
    })
    it('separates properties by /', async () => {
        const schema = await extractStepSchema({
            abstractionWidgetText: `person`,
            exampleWidgetText: `person
                            first name: Mohsen/last name: Bazmi`
        })
        schema.properties.first_name.example.should.eq('Mohsen')
    })
    it('rejects when the title is not in abstraction widget or example widget', async () => {
        extractStepSchema({
            abstractionWidgetText: ``,
            exampleWidgetText: `first name: Mohsen/last name: Bazmi`
        }).catch(err => err.should.not.be.null)
    })
    it('skips white spaces from abstraction title', async () => {
        const schema = await extractStepSchema({
            abstractionWidgetText: `                person                 `,
            exampleWidgetText: ``
        })
        schema.title.should.eq('person')
    })
    it('it replaces spaces between property names with _',async () => {
        const schema = await extractStepSchema({
            abstractionWidgetText: `person`,
            exampleWidgetText: `person
                            first name is separated by space`
        })
        schema.properties.first_name_is_separated_by_space.should.not.undefined
    })
})