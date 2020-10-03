Package.describe({
  name: 'seba:minifiers-autoprefixer',
  version: '2.0.0',
  summary: 'Standard minifiers used with Meteor apps by default + css autoprefixer.',
  git: 'https://github.com/sebakerckhof/meteor-minifiers-autoprefix.git',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: "minifyStdCSS",
  use: [
    'minifier-css@1.5.3',
    'ecmascript@0.14.3'
  ],
  npmDependencies: {
    "source-map": "0.7.3",
    "lru-cache": "6.0.0",
    "postcss": "8.1.1",
    "autoprefixer": "10.0.1",
    "@babel/runtime": "7.11.2"
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
