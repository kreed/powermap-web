const path = require("path");
const { getLoader, loaderNameMatches, injectBabelPlugin } = require("react-app-rewired");

function createRewireLess(lessLoaderOptions = {}) {
	return function(config, env) {
		const lessExtension = /\.less$/;

		const fileLoader = getLoader(
			config.module.rules,
			rule => loaderNameMatches(rule, 'file-loader')
		);
		fileLoader.exclude.push(lessExtension);
		fileLoader.exclude.push(/\.variables$/);
		fileLoader.exclude.push(/\.example$/);
		fileLoader.exclude.push(/\.overrides$/);

		const cssRules = getLoader(
			config.module.rules,
			rule => String(rule.test) === String(/\.css$/)
		);

		let lessRules;
		if (env === "production") {
			lessRules = {
				test: lessExtension,
				loader: [
					...cssRules.loader,
					{ loader: 'semantic-ui-less-module-loader', options: { siteFolder: path.join(__dirname, 'semantic/site'), themeConfigPath: path.join(__dirname, 'semantic/theme.config.less') } }
				],
			};
		} else {
			lessRules = {
				test: lessExtension,
				use: [
					...cssRules.use,
					{ loader: 'semantic-ui-less-module-loader', options: { siteFolder: path.join(__dirname, 'semantic/site'), themeConfigPath: path.join(__dirname, 'semantic/theme.config.less')} }
				],
			};
		}

		const oneOfRule = config.module.rules.find((rule) => rule.oneOf !== undefined);
		if (oneOfRule) {
			oneOfRule.oneOf.unshift(lessRules);
		} else {
			// Fallback to previous behaviour of adding to the end of the rules list.
			config.module.rules.push(lessRules);
		}

		return config;
	};
}

module.exports = function override(config, env) {
	config = createRewireLess()(config, env);
	config = injectBabelPlugin(['transform-semantic-ui-react-imports', {
		"addLessImports": true
	}], config);
	return config;
};
