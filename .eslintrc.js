module.exports = {
    //root: true,
    extends: [
        'airbnb-base',
        'prettier',
        'prettier/react'
    ],
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 8,
        ecmaFeatures: {

        }
    },
    plugins: [
        'react',
        'prettier'
    ],
    env: {
        node: true,
        browser: true
    },
    rules: {
        indent: [2, 4],
        quotes: [2, 'single'],
        'react/jsx-filename-extension': [
            2,
            {
                extensions: ['.js', '.jsx'],
            },
        ],
        'react/jsx-indent': [2, 4],
        'import/prefer-default-export': 0,
        'react/forbid-prop-types': 0,
        'react/prefer-stateless-function': 0,
        'react/jsx-props-no-spreading': 0,
        'react/destructuring-assignment': 0
    },
};