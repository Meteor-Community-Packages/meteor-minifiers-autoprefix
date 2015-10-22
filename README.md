Standard Minifiers + Autoprefixing
===

This package provides two minifier plugins used for Meteor apps by default.

The JS minifier uses UglifyJS2. The options include name-mangling and other
commonly used options.

The CSS minifier mostly reduces amount of white-space parsing CSS with
ParseCSS.

## Configuration
CSS can be prefixed with autoprefixer.

You can set the configuration by creating a `postcss.json` file in the `.meteor` folder of your app.
Example:
```json
{
    "autoprefixer" : { "browsers": ["last 2 versions"] }
}
```