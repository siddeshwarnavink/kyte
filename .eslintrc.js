module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        'node': true,
        'jest/globals': true,
        'cypress/globals': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 12,
        'sourceType': 'module'
    },
    'plugins': [
        'jest',
        'cypress'
    ],
    'rules': {
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
        'cypress/no-assigning-return-values': 'error',
        'cypress/no-unnecessary-waiting': 'error',
        'cypress/assertion-before-screenshot': 'warn',
        'cypress/no-force': 'warn',
        'cypress/no-async-tests': 'error',
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'class-methods-use-this': 'off'
    }
};
