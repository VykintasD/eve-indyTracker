module.exports = {
    parser: 'babel-eslint',  // Use Babel parser for JavaScript
    extends: [
      'plugin:vue/essential',  // For Vue support
      'eslint:recommended',  // Basic ESLint rules
    ],
    env: {
      browser: true,  // Allow browser globals
      node: true,     // Allow Node.js globals
    },
    rules: {
      // Your custom ESLint rules here
    },
  };
  