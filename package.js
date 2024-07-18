Package.describe({
  name: 'seba:minifiers-autoprefixer',
  version: '3.0.0-rc.1',
  summary: 'Standard minifiers used with Meteor apps by default + css autoprefixer.',
  git: 'https://github.com/sebakerckhof/meteor-minifiers-autoprefix.git',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: "minifyStdCSS",
  use: [
    'minifier-css@2.0.0',
    'ecmascript@0.16.9'
  ],
  npmDependencies: {
    "source-map": "0.7.4",
    "lru-cache": "11.0.0",
    "postcss": "8.4.39",
    "autoprefixer": "10.4.19",
    "@babel/runtime": "7.24.8"
  },
  sources: [
    'plugin/minify-css.js'
  ]
});

Package.onUse(function(api) {
  api.use('isobuild:minifier-plugin@1.0.0');
});

Package.onTest(function(api) {});
