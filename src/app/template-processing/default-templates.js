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
        contentTemplate: `using {{pascalCase context.title}};
using Xunit;

namespace {{pascalCase context.title}}.Tests
{
 {{#* inline "callConstructor"}}
new {{pascalCase title}}({{#each schema.properties}}"{{this.example}}"{{#unless @last}},{{/unless}}{{/each}}){{/inline}}    public class {{pascalCase scenario.title}}
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

        public object Subject { get; } = new { Title = nameof({{pascalCase subject.title}}) };

        [Fact]
        public void Run()
        {
            //The "Run" function can be abstracted away.

            var dbSpy = new dbSpy();
            var cmdHandler = new {{pascalCase subject.title}}CommandHandler(new {{pascalCase subject.title}}Repository(dbSpy));

            Given.ForEach(cmdHandler.Handle);
            cmdHandler.Handle(When);
            Then.ForEach(then => dbSpy.Events.Should().ContainEquivalentOf(then));
        }
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
            //Given
            {{#if given}}
            {{pascalCase @root.subject.title}} {{camelCase @root.subject.title}} = {{pascalCase @root.subject.title}}.CreateFromHistory(new IDomainEvent[]{
                {{#each given as |step|}}
            {{>format schema=step.schema }},
                {{/each}} });
            {{/if}} 
            
        
            //When
            {{#if given}}
            {{camelCase @root.subject.title}}{{else}}
            {{pascalCase @root.subject.title}} {{camelCase @root.subject.title}} = {{pascalCase @root.subject.title}}{{/if}}.{{>object schema=when.schema title=when.title}};
           
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
                        {{camelCase key}}: {{> format schema=value }}{{#unless @last}},{{/unless}}
{{/each}}
            ){{/inline}}

{{#*inline "format_undefined" schema}}
STRUCTURAL ERROR: UNKNOWN SCHEMA TYPE:
The field 'type' is not found in the schema
---------INTERNAL-SCHEMA:--------------------
{{{yaml schema}}}
------------THIS:--------------------
{{{yaml .}}}
{{/inline}}

`
    },
    {
        templateName: "gherkin-scenario",
        fileNameTemplate: "{{scenario.title}}",
        fileExtension: "features",
        contentTemplate: `Scenario Outline: {{sentenceCase scenario.title}}
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


