Package.describe({
  name: 'seba:minifiers-autoprefixer',
  version: '1.0.1',
  summary: 'Standard minifiers used with Meteor apps by default + css autoprefixer.',
  git: 'https://github.com/sebakerckhof/meteor-minifiers-autoprefix.git',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: "minifyStdCSS",
  use: [
    'minifier-css@1.1.10'
  ],
  npmDependencies: {
    "source-map": "0.5.3",
    "postcss": "5.0.19",
    "autoprefixer": "6.3.6",
    "bless": "4.0.3"
  },
  sources: [
    'plugin/minify-css.js'
  ]
});

Package.onUse(function(api) {
  api.use('isobuild:minifier-plugin@1.0.0');
});

Package.onTest(function(api) {
});
