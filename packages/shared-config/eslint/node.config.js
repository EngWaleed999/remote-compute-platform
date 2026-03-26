// قواعد خاصة بـ Node.js/Backend
import base from './base.config.js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...base, // توسيع القواعد الأساسية
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tsParser, // استخدام TypeScript parser
      parserOptions: {
        project: './tsconfig.json', // ربط بـ tsconfig
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin, // تفعيل plugin TypeScript
    },
    rules: {
      ...tsPlugin.configs.recommended.rules, // قواعد TypeScript الموصى بها
      '@typescript-eslint/explicit-function-return-type': 'off', // عدم إجبار تحديد نوع الإرجاع
      '@typescript-eslint/no-explicit-any': 'warn', // تحذير من استخدام any
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
];
