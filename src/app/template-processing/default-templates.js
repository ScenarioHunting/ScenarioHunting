export const defaultTemplates = [
    {
        templateName: "cs-aggregate-gwt",
        fileNameTemplate: "{{scenario}}",
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

namespace {{context}}.Tests
{
{{#* inline "callConstructor"}}
new {{title}}({{#each properties}}"{{this.example}}"{{#skipLast}},{{/skipLast}}{{/each}}){{/inline}}

public class {{scenario}} : IStorySpecification
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

    public string Subject { get; } = nameof({{subject}});

    [Fact]
    public void Run()
    => TestAdapter.Test(this
            , setupUseCases: eventStore =>
                    new[] {
                    new {{subject}}UseCases(new Repository<{{subject}}.State>(eventStore))
                    });
}
}`
    },
    {
        templateName: "cs-aggregate",
        fileNameTemplate: "{{scenario}}",
        fileExtension: "cs",
        contentTemplate: `using Xunit;
        using FluentAssertions;
        using {{context}};
        
        namespace {{pascalCase context}}
        {
            public class {{pascalCase scenario}}Spec
            {
                [Fact]
                public void {{pascalCase scenario}}()
                {
                    var {{camelCase subject}} = {{pascalCase subject}}.{{pascalCase when.title}}({{#each when.properties as |property propertyName|}}"{{property.example}}"{{#skipLast}},{{/skipLast}}{{/each}});
                    
                    {{camelCase subject}}.Events.Should().ContainInOrder(
                        {{#each then as |step|}}
                            new {{pascalCase step.title}}({{#each step.properties as |property propertyName|}}"{{property.example}}"{{#skipLast}},{{/skipLast}}{{/each}}){{#skipLast}},{{/skipLast}}
                        {{/each}});
                }
            }
        }`
    },
    {
        templateName: "gherkin-scenario",
        fileNameTemplate: "{{scenario}}",
        fileExtension: "features",
        contentTemplate: `Scenario Outline: {{spaceCase scenario}}
        Given {{#each given as |step|}}{{spaceCase title}} {{#each step.properties as |property propertyName|}}
          | {{spaceCase propertyName}} | "{{example}}" |{{/each}}
        {{#skipLast}} And {{/skipLast}}{{/each}}
        When {{#with when as |step|}} {{spaceCase title}} {{#each step.properties as |property propertyName|}}
          | {{spaceCase propertyName}} | "{{example}}" |{{/each}}
        {{/with}}
        Then {{#each then as |step|}}{{spaceCase title}} {{#each step.properties as |property propertyName|}}
          | {{spaceCase propertyName}} | "{{example}}" |{{/each}}
        {{#skipLast}} And {{/skipLast}}{{/each}}`
    },
]