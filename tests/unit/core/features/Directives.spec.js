import Directives from "../../../../src/core/widget/features/Directives"

test('isDirective() shoud return true if it is a valid Directive', () => {
    const directive = new Directives;

    const result1 = directive.isDirective({ name: ':valid' });
    const result2 = directive.isDirective({ name: 'invalid' });

    expect(result1).toBe(true);
    expect(result2).toBe(false);
})

test('extractAttributeName() shoud get the actual attribute name', () => {
    const directive = new Directives;

    const result = directive.extractAttributeName({ name: ':valid' });

    expect(result).toBe('valid');
})