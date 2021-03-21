module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base", "plugin:node/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    "array-callback-return": "warn",
    "arrow-body-style": "warn",
    "import/no-unresolved": [
      1,
      {
        ignore: ["api", "config", "db", "lib"],
      },
    ],

    // With 'autofix import' setting - no need!
    "import/order": 0,
    "import/prefer-default-export": 1,
    "no-debugger": "warn",
    "no-param-reassign": "warn",
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    "no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "node/no-unsupported-features/es-syntax": [
      "warn",
      {
        ignores: ["modules"],
      },
    ],
  },
};
