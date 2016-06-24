Standard Minifier for CSS + autoprefixing
===

This package provides a minifier plugin used for Meteor apps by default and adds autoprefixing to it.

The CSS minifier mostly reduces amount of white-space parsing CSS with ParseCSS.

For Meteor 1.2 use version 0.0.2
For Meteor 1.3 use version 1.0.0

## Configuration

You can set the autoprefix configuration by creating a `postcss.json` file in the root folder of your app.
Example:
```json
{
    "autoprefixer" : { "browsers": ["last 2 versions"] }
}
```
