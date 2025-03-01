module.exports = {
	parserOptions: {
		parser: 'babel-eslint'
	},
	extends: [
		'plugin:vue/recommended',
		'standard',
		'airbnb/base',
	],
	plugins: [
		'vue',
	],
	rules: {
		'vue/v-on-style': 'off',
		'vue/v-bind-style': 'off',
		'vue/no-v-html': 'off',
		'max-len': 'off',
		'no-console': 'off',
    'no-useless-escape': 'off',
    'no-restricted-globals': 'off',
		'array-callback-return': 'off',
		'no-unused-vars': 'off',
		'indent': 'off',
    'no-nested-ternary': 'off',
    'no-underscore-dangle': 'off',
    'prefer-destructuring': 'off',
	}
}
