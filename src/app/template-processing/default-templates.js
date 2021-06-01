export const defaultTemplates = [
    {
        templateName: "cs-aggregate-gwt",
        fileNameTemplate: "{{scenario}}",
        fileExtension: "cs",
        contentTemplate: `using StoryTest;
using Vlerx.Es.Messaging;
using Vlerx.Es.Persistence;
using Vlerx.SampleContracts.{{subject}};
using Vlerx.{{toCamelCase context}}.{{subject}};
using Vlerx.{{toPascalCase context}}.{{subject}}.Commands;
using Vlerx.{{toKebabCase context}}.Tests.StoryTests;
using Vlerx.{{toSpaceCase context}}.Tests.StoryTests;
using Vlerx.{{toSentenceCase context}}.Tests.StoryTests;
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
        
        namespace {{toPascalCase context}}
        {
            public class {{toPascalCase scenario}}Spec
            {
                [Fact]
                public void {{toPascalCase scenario}}()
                {
                    var {{toCamelCase subject}} = {{toPascalCase subject}}.{{toPascalCase when.title}}({{#each when.properties as |property propertyName|}}"{{property.example}}"{{#skipLast}},{{/skipLast}}{{/each}});
                    
                    {{toCamelCase subject}}.Events.Should().ContainInOrder(
                        {{#each then as |step|}}
                            new {{toPascalCase step.title}}({{#each step.properties as |property propertyName|}}"{{property.example}}"{{#skipLast}},{{/skipLast}}{{/each}}){{#skipLast}},{{/skipLast}}
                        {{/each}});
                }
            }
        }`
    },
    {
        templateName: "gherkin-scenario",
        fileNameTemplate: "{{scenario}}",
        fileExtension: "features",
        contentTemplate: `Scenario Outline: {{toSpaceCase scenario}}
        Given {{#each given as |step|}}{{toSpaceCase title}} {{#each step.properties as |property propertyName|}}
          | {{toSpaceCase propertyName}} | "{{example}}" |{{/each}}
        {{#skipLast}} And {{/skipLast}}{{/each}}
        When {{#with when as |step|}} {{toSpaceCase title}} {{#each step.properties as |property propertyName|}}
          | {{toSpaceCase propertyName}} | "{{example}}" |{{/each}}
        {{/with}}
        Then {{#each then as |step|}}{{toSpaceCase title}} {{#each step.properties as |property propertyName|}}
          | {{toSpaceCase propertyName}} | "{{example}}" |{{/each}}
        {{#skipLast}} And {{/skipLast}}{{/each}}`
    },
]