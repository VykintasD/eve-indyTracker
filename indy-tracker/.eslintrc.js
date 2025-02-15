module.exports = {
  parserOptions: {
    ecmaVersion: 2021, // Ensure modern JS support
    sourceType: "module",
  },
  extends: [
    "plugin:vue/vue3-recommended", // Use Vue 3 specific rules
    "eslint:recommended", // Basic ESLint rules
  ],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    "vue/multi-word-component-names": "off", // Disable multi-word component name rule
  },
};
