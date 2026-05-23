// قواعد خاصة بـ React/Frontend
import base from './base.config.js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...base, // توسيع القواعد الأساسية
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true }, // تفعيل JSX
      },
      globals: {
        document: 'readonly',
        window: 'readonly',
      },
    },
    plugins: {
      react: reactPlugin, // تفعيل React
      'react-hooks': reactHooksPlugin, // تفعيل React Hooks
      'jsx-a11y': jsxA11yPlugin, // تفعيل accessibility
    },
    settings: {
      react: { version: 'detect' }, // اكتشاف إصدار React تلقائياً
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // Vite لا يحتاج import React
      'react/prop-types': 'off', // TypeScript بدلاً من PropTypes
      'react-hooks/rules-of-hooks': 'error', // التحقق من قواعد Hooks
      'react-hooks/exhaustive-deps': 'warn', // التحقق من dependencies
    },
  },
];
