const { FlatCompat } = require("@eslint/eslintrc");
const path = require("path");

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...compat.extends(
    "next/core-web-vitals",
    "plugin:@typescript-eslint/strict",
    "prettier"
  ),
  {
    rules: {},
  },
  {
    ignores: ["quillio/**", ".next/**", "node_modules/**"],
  },
];

module.exports = config;
