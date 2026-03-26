module.exports = {
  root: true,
  extends: ['@repo/eslint-config'], // إذا سويت shared-config
  parserOptions: {
    project: './tsconfig.json',
  },
};
