Package.describe({
  name: 'seba:minifiers-autoprefixer',
  version: '1.1.1',
  summary: 'Standard minifiers used with Meteor apps by default + css autoprefixer.',
  git: 'https://github.com/sebakerckhof/meteor-minifiers-autoprefix.git',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: "minifyStdCSS",
  use: [
    'minifier-css'
  ],
  npmDependencies: {
    "source-map": "0.5.6",
    "lru-cache": "4.0.1",
    "postcss": "7.0.2",
    "autoprefixer": "9.1.2",
    "@babel/runtime": "7.0.0"
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
