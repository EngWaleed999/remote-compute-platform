// القواعد الأساسية المشتركة بين كل المشروع
/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // السماح بـ _ للمتغيرات غير المستخدمة
      'no-console': ['warn', { allow: ['error', 'warn', 'info'] }], // تحذير من console.log العشوائي
      'prefer-const': 'error', // إجبار const بدل let إذا لم يتغير
      'no-var': 'error', // منع var نهائياً
      eqeqeq: ['error', 'always'], // إجبار === بدل ==
    },
  },
  prettierConfig,
];
