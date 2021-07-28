export const defaultTemplates = [
    {
        templateName: 'new',
        contentTemplate: '{{{yaml .}}}',
        fileExtension: 'yml',
        fileNameTemplate: '{{snakeCase scenario}}',
    },
    {
        templateName: "cs-aggregate-gwt",
        fileNameTemplate: "{{pascalCase scenario}}",
        fileExtension: "cs",
        contentTemplate: `using StoryTest;
        using Vlerx.Es.Messaging;
        using Vlerx.Es.Persistence;
        using Vlerx.SampleContracts.{{subject}};
        using Vlerx.{{camelCase context}}.{{subject}};
        using Vlerx.{{pascalCase context}}.{{subject}}.Commands;
        using Vlerx.{{kebabCase context}}.Tests.StoryTests;
        using Vlerx.{{spaceCase context}}.Tests.StoryTests;
        using Vlerx.{{sentenceCase context}}.Tests.StoryTests;
        using Xunit;
        
        namespace {{pascalCase context}}.Tests
        {
        {{#* inline "callConstructor"}}
        new {{pascalCase title}}({{#each properties}}"{{this.example}}"{{#skipLast}},{{/skipLast}}{{/each}}){{/inline}}    public class {{pascalCase scenario}} : IStorySpecification
            {
                public IDomainEvent[] Given
                => new IDomainEvent[]{
            {{#each given.schema}}
                {{> callConstructor .}},
            {{/each}}
                };
        
                public ICommand When
                => {{> callConstructor when.schema}};
        
                public IDomainEvent[] Then
                => new IDomainEvent[]{
            {{#each then.schema}}
                {{> callConstructor .}},
            {{/each}}
                };
        
                public string Subject { get; } = nameof({{pascalCase subject}});
        
                [Fact]
                public void Run()
                => TestAdapter.Test(this
                        , setupUseCases: eventStore => new[] { 
                            new {{pascalCase subject}}UseCases(new Repository<{{pascalCase subject}}.State>(eventStore)) });
            }
        }`
    },
    {
        templateName: "cs-aggregate",
        fileNameTemplate: "{{scenario}}",
        fileExtension: "cs",
        contentTemplate: `{{> main}}
        {{>format_undefined}}
        {{#*inline 'main'}}
        using Xunit;
        using FluentAssertions;
        using {{context}};
        
        namespace {{toPascalCase context}}
        {
            public class {{toPascalCase scenario}}Spec
            {
                [Fact]
            {{#each data as |example key|}}
                public void {{toPascalCase @root.scenario}}{{#if key}}{{key}}{{/if}}()
                {
                    var {{toCamelCase @root.subject}} = new {{toPascalCase @root.subject}}();
                   
                {{#each example.given as |value key|}}
                    {{toCamelCase @root.subject}}.On({{>format data=value schema=(lookup (lookup ../../given key) 'schema')  }});
                {{/each}}
        
                    {{toCamelCase @root.subject}}.Handle({{>format data=example.when schema=../when.schema  }});
                    {{!-- {{toCamelCase @root.subject}}.{{toPascalCase @root.when.schema.title}}({{>format data=example.when schema=../when.schema  }}); --}}
        
                    {{toCamelCase  @root.subject}}.Events.Should().ContainEquivalentOf(
                    {{#each example.then as |value key|}}
                        {{>format data=value schema=(lookup (lookup ../../then key) 'schema')  }}
                    {{/each}}
        );
                }
            {{/each}}
            }
        }
        {{/inline}}
        
        {{#*inline "format" data schema}}
        {{>(concat 'format_' schema.type) data=data schema=schema}}
        {{/inline}}
        
        {{#*inline "format_string" data}}"{{data}}"{{/inline}}
        {{#*inline "format_number" data}}{{data}}{{/inline}}
        {{#*inline "format_boolean" data}}{{data}}{{/inline}}
        {{#*inline "format_object"  data schema}}new {{pascalCase schema.title}}(
            {{#each data as |value key|}}
                                {{key}}: {{> format data=value schema=(lookup ../schema.properties key) }}{{#unless @last}},{{/unless}}
            {{/each}}        ){{/inline}}
        
        {{#*inline "format_array" data schema }}
                {{#if schema.items.[0]}}
        new[]{ {{#each data as |value key|}}
                                        {{>format data=value schema=(lookup ../schema.items key)}}{{#unless @last}},{{/unless}}{{/each}}   
                                    }{{else}}new({{#each data as |value key|}}
                                        {{>format  data=value schema=../schema.items}}{{#unless @last}},{{/unless}}{{/each}}
                                    ){{/if}}{{/inline}}
        
        
        
        {{#*inline "format_undefined" data schema}}
        STRUCTURAL ERROR: UNKNOWN SCHEMA TYPE:
        The field 'type' is not found in the schema
        ---------Internal-SCHEMA:------------
        {{{yaml schema}}}
        ---------INTERNAL-DATA:--------------------
        {{{yaml data}}}
        ------------THIS:--------------------
        {{{yaml .}}}
        {{/inline}}`
    },
    {
        templateName: "gherkin-scenario",
        fileNameTemplate: "{{scenario}}",
        fileExtension: "features",
        contentTemplate: `Scenario Outline: {{spaceCase scenario}}
        {{#each data}}
            Given {{#each given as |step index|}}{{spaceCase (lookup (lookup (lookup @root.given index) 'schema') 'title')}} {{>table object=step}}
            {{#unless @last}} And {{/unless}}{{/each}}When {{#with when as |step|}} {{spaceCase @root.when.schema.title}} {{>table object=step}}
            {{/with}}
            Then {{#each then as |step index|}}{{spaceCase (lookup (lookup (lookup @root.then index) 'schema') 'title')}} {{>table object=step}}
            {{#unless @last}} And {{/unless}}{{/each}}
        {{/each}}
        
        {{#*inline 'table' object}}{{#each object as |value title|}}
                {{>row title=title  value=value}}{{/each}}{{/inline}}
        
        {{#*inline 'row' title value}}
        | {{>column (spaceCase title)}} | {{>column value}} |{{/inline}}
        
        {{#*inline 'column'}}
        {{.}} {{>fill_rest}}{{/inline}}
        
        {{#*inline 'fill_rest'}}
        {{repeat ' ' (subtract 20 (lookup (lowerCase . ) 'length'))}}{{/inline}}`
    },
]