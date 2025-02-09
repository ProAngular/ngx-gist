/** Prettier configuration and options. */
const prettierConfig = {
  $schema: 'https://json.schemastore.org/prettierrc',
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  embeddedLanguageFormatting: 'auto',
  endOfLine: 'lf',
  experimentalTernaries: false,
  printWidth: 80,
  proseWrap: 'always',
  quoteProps: 'as-needed',
  semi: true,
  singleAttributePerLine: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  // Order of import declarations
  importOrder: [
    // Angular first.
    '^@angular/(.*)$',
    // Local application files second.
    '^src/app/(.*)$',
    // Third-party libraries third.
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

module.exports = prettierConfig;
