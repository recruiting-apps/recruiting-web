module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts', 'tailwind.config.js'],
    extends: [
        "plugin:react/recommended",
        "standard-with-typescript"
    ],
    overrides: [
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
    },
    plugins: [
        "react"
    ],
    rules: {
        "react/react-in-jsx-scope": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "react/prop-types": "off",
        "@typescript-eslint/strict-boolean-expressions": "off"
    }
}

