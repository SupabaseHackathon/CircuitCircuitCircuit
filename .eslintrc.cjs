module.exports = {
  env: {
    jest: true,
    node: true,
  },
  root: true,
  plugins: ['@typescript-eslint', 'import', 'prettier', 'react-hooks'],
  extends: ['plugin:react/recommended', 'plugin:react/jsx-runtime'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  extends: [
    'plugin:import/typescript',
    'prettier',
    'plugin:prettier/recommended',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: 'tsconfig.json',
      },
    },
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
    '*.js',
    '*.d.ts',
    'node_modules/',
    '*.generated.ts',
    'coverage',
    'graphql-types.ts',
    'jest.config.ts',
    'jest.shared.config.ts',
    'vite.config.ts',
    '.eslintrc.cjs',
  ],
  rules: {
    'react/react-in-jsx-scope': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'prettier/prettier': ['error', { singleQuote: true }],
    '@typescript-eslint/no-require-imports': ['error'],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/test/**',
          '**/build-tools/**',
          '**/*.test.{ts,tsx}',
          '**/*.spec.{ts,tsx}',
          '**/*.stories.tsx',
          '**/setupTests.ts',
          '**/setup/*.tsx',
          './vite.config.ts',
        ],
        optionalDependencies: false,
        peerDependencies: true,
      },
    ],
    'import/no-unresolved': ['error'],
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-duplicates': ['error'],
    'no-shadow': ['off'],
    '@typescript-eslint/no-shadow': ['error'],
    'key-spacing': ['error'],
    'no-multiple-empty-lines': ['error'],
    '@typescript-eslint/no-floating-promises': ['error'],
    'no-return-await': ['off'],
    '@typescript-eslint/return-await': ['error'],
    'no-trailing-spaces': ['error'],
    'dot-notation': ['error'],
    'no-bitwise': ['error'],
    '@typescript-eslint/member-ordering': [
      'error',
      {
        default: [
          'public-static-field',
          'public-static-method',
          'protected-static-field',
          'protected-static-method',
          'private-static-field',
          'private-static-method',
          'field',
          'constructor',
          'method',
        ],
      },
    ],
    quotes: [2, 'single', { avoidEscape: true }],
  },
};
