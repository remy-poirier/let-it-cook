import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import stylistic from '@stylistic/eslint-plugin'

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  },
  {
    languageOptions: { globals: globals.browser },
  },
  stylistic.configs.customize({}),
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      '@stylistic': stylistic,
    },
  },
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
]
