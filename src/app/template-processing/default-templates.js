export const defaultTemplates = [
    {
        templateName: "sample-template",
        fileNameTemplate: "{{scenario}}",
        fileExtension: "cs",
        contentTemplate: `using StoryTest;
using Vlerx.Es.Messaging;
using Vlerx.Es.Persistence;
using Vlerx.SampleContracts.{{sut}};
using Vlerx.{{context}}.{{sut}};
using Vlerx.{{context}}.{{sut}}.Commands;
using Vlerx.{{context}}.Tests.StoryTests;
using Xunit;

namespace {{context}}.Tests
{
{{#* inline "callConstructor"}}
new {{title}}({{#each properties}}"{{example}}"{{#skipLast}},{{/skipLast}}{{/each}}){{/inline}}

public class {{scenario}} : IStorySpecification
{
    public IDomainEvent[] Given
    => new IDomainEvent[]{
{{#each givens}}
    {{> callConstructor .}},
{{/each}}
    };

    public ICommand When
    => {{> callConstructor when}};

    public IDomainEvent[] Then
    => new IDomainEvent[]{
{{#each thens}}
    {{> callConstructor .}},
{{/each}}
    };

    public string Sut { get; } = nameof({{sut}});

    [Fact]
    public void Run()
    => TestAdapter.Test(this
            , setupUseCases: eventStore =>
                    new[] {
                    new {{sut}}UseCases(new Repository<{{sut}}.State>(eventStore))
                    });
}
}`
    },
    {
        templateName: "sample-template2",
        fileNameTemplate: "{{scenario}}",
        fileExtension: "features",
        contentTemplate: `using StoryTest;
using Vlerx.Es.Messaging;
using Vlerx.Es.Persistence;
using Vlerx.SampleContracts.{{sut}};
using Vlerx.{{context}}.{{sut}};
using Vlerx.{{context}}.{{sut}}.Commands;
using Vlerx.{{context}}.Tests.StoryTests;
using Xunit;

namespace {{context}}.Tests
{
{{#* inline "callConstructor"}}
new {{title}}({{#each properties}}"{{example}}"{{#skipLast}},{{/skipLast}}{{/each}}){{/inline}}

public class {{scenario}} : IStorySpecification
{
    public IDomainEvent[] Given
    => new IDomainEvent[]{
{{#each givens}}
    {{> callConstructor .}},
{{/each}}
    };
    public ICommand When
    => {{> callConstructor when}};
    public IDomainEvent[] Then
    => new IDomainEvent[]{
{{#each thens}}
    {{> callConstructor .}},
{{/each}}
    };

    public string Sut { get; } = nameof({{sut}});

    [Fact]
    public void Run()
    => TestAdapter.Test(this
            , setupUseCases: eventStore =>
                    new[] {
                    new {{sut}}UseCases(new Repository<{{sut}}.State>(eventStore))
                    });
}
}`
    },
]