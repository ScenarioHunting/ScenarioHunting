export const defaultTemplates = [
    {
        templateName: 'new',
        contentTemplate: '{{{yaml .}}}',
        fileExtension: 'yml',
        fileNameTemplate: '{{snakeCase scenario.title}}',
    },
    {
        templateName: "cs-aggregate-gwt",
        fileNameTemplate: "{{pascalCase scenario.title}}",
        fileExtension: "cs",
        contentTemplate: `using StoryTest;
using Vlerx.Es.Messaging;
using Vlerx.Es.Persistence;
using Vlerx.SampleContracts.{{pascalCase subject.title}};
using Vlerx.{{pascalCase context.title}}.{{pascalCase subject.title}};
using Vlerx.{{pascalCase context.title}}.{{pascalCase subject.title}}.Commands;
using Vlerx.{{pascalCase context.title}}.Tests.StoryTests;
using Xunit;

namespace {{pascalCase context.title}}.Tests
{
 {{#* inline "callConstructor"}}
new {{pascalCase title}}({{#each schema.properties}}"{{this.example}}"{{#unless @last}},{{/unless}}{{/each}}){{/inline}}    public class {{pascalCase scenario.title}} : IStorySpecification
    {
        public IDomainEvent[] Given
        => new IDomainEvent[]{
    {{#each given}}
        {{> callConstructor .}},
    {{/each}}
        };

        public ICommand When
        => {{> callConstructor when}};

        public IDomainEvent[] Then
        => new IDomainEvent[]{
    {{#each then}}
        {{> callConstructor .}},
    {{/each}}
        };

        public object subject.title { get; } = new { Title = nameof({{pascalCase subject.title}}) };

        [Fact]
        public void Run()
        => TestAdapter.Test(this
                , setupUseCases: eventStore => new[] { 
                    new {{pascalCase subject.title}}UseCases(new Repository<{{pascalCase subject.title}}.State>(eventStore)) });
    }
}
`
    },
    {
        templateName: "cs-aggregate",
        fileNameTemplate: "{{scenario.title}}",
        fileExtension: "cs",
        contentTemplate: `{{> main}}
{{#*inline 'main'}}
using Xunit;
using FluentAssertions;
using {{pascalCase context.title}};

namespace {{pascalCase context.title}}
{
    public class {{pascalCase scenario.title}}Spec
    {
        [Fact]
        public void {{pascalCase scenario.title}}()
        {
            var {{camelCase @root.subject.title}} = new {{pascalCase @root.subject.title}}();

            //Given
        {{#each given as |step|}}
            {{camelCase @root.subject.title}}.On({{>format schema=step.schema }});
        {{/each}}

            //When            
            {{camelCase @root.subject.title}}.{{>object schema=when.schema title=when.title}}
           
            //Then
            {{#each then as |step|}}
            {{camelCase  @root.subject.title}}.Events.Should().ContainEquivalentOf(
                {{>format schema=step.schema }}
);
            {{/each}}
        }
    }
}
{{/inline}}

{{#*inline "format" schema}}
{{>(concat 'format_' schema.type) schema=schema}}
{{/inline}}

{{#*inline "format_string" schema}}"{{schema.example}}"{{/inline}}
{{#*inline "format_number" schema}}{{schema.example}}{{/inline}}
{{#*inline "format_boolean" schema}}{{schema.example}}{{/inline}}
{{#*inline "format_object"  schema}}new {{>object schema=schema title=title}}{{/inline}}

{{#*inline "format_array" schema }}
         {{#if schema.items.[0]}}
new[]{ {{#each schema.items as |value key|}}
                                {{>format schema=value }}{{#unless @last}},{{/unless}}{{/each}}
                            }{{else}}{{>format  schema=schema.items }}{{/if}}{{/inline}}

{{#*inline "object" schema title}}{{pascalCase title}}(
    {{!-- TODO: It should be title of object not scenario's --}}
    {{#each schema.properties as |value key|}}
                        {{key}}: {{> format schema=value }}{{#unless @last}},{{/unless}}
{{/each}}
            ){{/inline}}

{{#*inline "format_undefined" schema}}
STRUCTURAL ERROR: UNKNOWN SCHEMA TYPE:
The field 'type' is not found in the schema
---------INTERNAL-SCHEMA:--------------------
{{{yaml schema}}}
------------THIS:--------------------
{{{yaml .}}}
{{/inline}}`
    },
    {
        templateName: "gherkin-scenario",
        fileNameTemplate: "{{scenario.title}}",
        fileExtension: "features",
        contentTemplate: `Scenario Outline: {{spaceCase scenario.title}}
Given {{#each given as |step index|}}{{spaceCase step.title}} {{>table object=step.schema}}
{{#unless @last}} And {{/unless}}{{/each}}When {{#with when as |step|}} {{spaceCase step.title}} {{>table object=step.schema}}
{{/with}}
Then {{#each then as |step|}} {{spaceCase step.title}} {{>table object=step.schema}}
{{#unless @last}} And {{/unless}}{{/each}}

{{#*inline 'table' object}}{{#each object.properties as |property title|}}
        {{>row title=title  value=property.example}}{{/each}}{{/inline}}

{{#*inline 'row' title value}}
| {{>column (spaceCase title)}} | {{>column value}} |{{/inline}}

{{#*inline 'column'}}
{{.}} {{>fill_rest}}{{/inline}}

{{#*inline 'fill_rest'}}
{{repeat ' ' (subtract 15 (lookup (lowerCase .) 'length'))}}{{/inline}}
`
    },
]


