Package.describe({
  name: 'seba:minifiers-autoprefixer',
  version: '0.0.1',
  summary: 'Standard minifiers used with Meteor apps by default + css autoprefixer.',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: "minifyStd",
  use: [
    'minifiers'
  ],
  npmDependencies: {
    "source-map": "0.4.2",
    "postcss": "5.0.10",
    "autoprefixer": "6.0.3"
  },
  sources: [
    'plugin/minify-js.js',
    'plugin/minify-css.js'
  ]
});

Package.onUse(function(api) {
  api.use('isobuild:minifier-plugin@1.0.0');
});

Package.onTest(function(api) {
});
