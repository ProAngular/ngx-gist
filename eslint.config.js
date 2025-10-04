// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // Component selectors should follow given naming rules.
      // @see http://codelyzer.com/rules/component-selector/
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'ngx',
          style: 'kebab-case',
        },
      ],
      // Directive selectors should follow given naming rules.
      // @see http://codelyzer.com/rules/directive-selector/
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'ngx',
          style: 'camelCase',
        },
      ],
      // Prefer to declare @Output as readonly since they are not supposed
      // to be reassigned.
      // @see http://codelyzer.com/rules/prefer-output-readonly/
      '@angular-eslint/prefer-output-readonly': ['error'],
      // Enforce use of component selector rules.
      // @see http://codelyzer.com/rules/component-selector/
      '@angular-eslint/use-component-selector': ['error'],
      // Disallows using ViewEncapsulation.None.
      // @see http://codelyzer.com/rules/use-component-view-encapsulation/
      '@angular-eslint/use-component-view-encapsulation': ['error'],
      // Ensure that components implement life cycle interfaces if they use
      // them.
      // @see http://codelyzer.com/rules/use-life-cycle-interface/
      '@angular-eslint/use-lifecycle-interface': ['error'],
      // Require consistently using either T[] or Array<T> for arrays.
      // @see https://typescript-eslint.io/rules/array-type/
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      // Enforce consistent usage of type assertions.
      // @see https://typescript-eslint.io/rules/consistent-type-assertions/
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'as',
          objectLiteralTypeAssertions: 'never',
        },
      ],
      // Enforce type definitions to consistently use either interface or type.
      // @see https://typescript-eslint.io/rules/consistent-type-definitions/
      '@typescript-eslint/consistent-type-definitions': 'error',
      // Require explicit return types on functions and class methods.
      // @see https://typescript-eslint.io/rules/explicit-function-return-type/
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true },
      ],
      // Require explicit accessibility modifiers on class properties and methods.
      // @see https://typescript-eslint.io/rules/explicit-member-accessibility/
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'explicit' },
      ],
      // Require explicit return and argument types on exported functions' and
      // classes' public class methods.
      // @see https://typescript-eslint.io/rules/explicit-module-boundary-types/
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      // Require a consistent member declaration order.
      // @see https://typescript-eslint.io/rules/member-ordering/
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'constructor',
            'static-field',
            'instance-field',
            'static-method',
            'instance-method',
          ],
        },
      ],
      // Enforce naming conventions for everything across a codebase.
      // @see https://typescript-eslint.io/rules/naming-convention/
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'classProperty',
          format: ['PascalCase', 'camelCase'],
          modifiers: ['public'],
        },
        {
          selector: 'function',
          format: ['camelCase'],
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: false,
          },
        },
        {
          selector: 'enumMember',
          format: ['UPPER_CASE'],
        },
      ],
      // Disallow empty functions.
      // @see https://typescript-eslint.io/rules/no-empty-function/
      '@typescript-eslint/no-empty-function': 'error',
      // Disallow the declaration of empty interfaces.
      // @see https://typescript-eslint.io/rules/no-empty-interface/
      '@typescript-eslint/no-empty-interface': 'off',
      // Disallow the any type.
      // @see https://typescript-eslint.io/rules/no-explicit-any/
      '@typescript-eslint/no-explicit-any': 'error',
      // Disallow TypeScript namespaces.
      // @see https://typescript-eslint.io/rules/no-namespace/
      '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],
      // Disallow unused expressions.
      // @see https://typescript-eslint.io/rules/no-unused-expressions/
      '@typescript-eslint/no-unused-expressions': 'error',
      // Disallow unused variables.
      // @see https://typescript-eslint.io/rules/no-unused-vars/
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
      // Enforce the use of for-of loop over the standard for loop where
      // possible.
      // @see https://typescript-eslint.io/rules/prefer-for-of/
      '@typescript-eslint/prefer-for-of': ['warn'],
      // Enforce using function types instead of interfaces with call
      // signatures.
      // @see https://typescript-eslint.io/rules/prefer-function-type/
      '@typescript-eslint/prefer-function-type': ['warn'],
      // Disallow two overloads that could be unified into one with a union
      // or an optional/rest parameter.
      // @see https://typescript-eslint.io/rules/unified-signatures/
      '@typescript-eslint/unified-signatures': 'warn',
      // Require the use of === and !==
      // @see https://eslint.org/docs/latest/rules/eqeqeq
      eqeqeq: ['error'],
      // Require for-in loops to include an if statement
      // @see https://eslint.org/docs/latest/rules/guard-for-in
      'guard-for-in': ['error'],
      // Disallow bitwise operators
      // @see https://eslint.org/docs/latest/rules/no-bitwise
      'no-bitwise': ['error'],
      // Disallow the use of arguments.caller or arguments.callee
      // @see https://eslint.org/docs/latest/rules/no-caller
      'no-caller': ['error'],
      // Disallow the use of console
      // @see https://eslint.org/docs/latest/rules/no-console
      'no-console': ['error', { allow: ['warn', 'error'] }],
      // Disallow duplicate module imports
      // @see https://eslint.org/docs/latest/rules/no-duplicate-imports
      'no-duplicate-imports': ['error'],
      // Disallow empty block statements
      // @see https://eslint.org/docs/latest/rules/no-empty
      'no-empty': 'error',
      // Disallow the use of eval()
      // @see https://eslint.org/docs/latest/rules/no-eval
      'no-eval': ['error'],
      // Disallow new operators with the String, Number, and Boolean objects
      // @see https://eslint.org/docs/latest/rules/no-new-wrappers
      'no-new-wrappers': ['error'],
      // Disallow throwing literals as exceptions
      // @see https://eslint.org/docs/latest/rules/no-throw-literal
      'no-throw-literal': ['error'],
      // Require let or const instead of var
      // @see https://eslint.org/docs/latest/rules/no-var
      'no-var': ['error'],
      // Require or disallow method and property shorthand syntax for object
      // literals
      // @see https://eslint.org/docs/latest/rules/object-shorthand
      'object-shorthand': ['error'],
      // Enforce variables to be declared either together or separately in
      // functions
      // @see https://eslint.org/docs/latest/rules/one-var
      'one-var': ['error', 'never'],
      // Require using arrow functions for callbacks
      // @see https://eslint.org/docs/latest/rules/prefer-arrow-callback
      'prefer-arrow/prefer-arrow-functions': 'off',
      // Require const declarations for variables that are never reassigned
      // after declared
      // @see https://eslint.org/docs/latest/rules/prefer-const
      'prefer-const': ['error'],
      // Enforce the consistent use of the radix argument when using
      // parseInt()
      // @see https://eslint.org/docs/latest/rules/radix
      radix: ['error'],
      // Enforce consistent spacing after the // or /* in a comment
      // @see https://eslint.org/docs/latest/rules/spaced-comment
      'spaced-comment': ['error', 'always', { block: { balanced: true } }],
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
);
