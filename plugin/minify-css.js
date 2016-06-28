var sourcemap = Npm.require('source-map');

//START AUTOPREFIX
var autoprefixer  = Npm.require('autoprefixer');
var postcss       = Npm.require('postcss');
var Future        = Npm.require('fibers/future');
var bless         = Npm.require('bless');
var combineSrcMap = Npm.require('combine-source-map');
var path = Plugin.path;
var fs = Npm.require('fs');
var configpath = path.join(process.cwd(),'postcss.json');
var config;
if(!fs.existsSync(configpath)){
  config = {autoprefixer:{}};
}else{
  try{
    config = JSON.parse(fs.readFileSync(configpath,'utf-8'));
  }catch(e){
    throw "Post css configuration file error: "+e;
  }
}
//END AUTOPREFIX

Plugin.registerMinifier({
  extensions: ["css"]
}, function () {
  var minifier = new CssToolsMinifier();
  return minifier;
});

function CssToolsMinifier () {};

CssToolsMinifier.prototype.processFilesForBundle = function (files, options) {
  var mode = options.minifyMode;

  if (! files.length) return;

  var merged = mergeCss(files);

  //START AUTOPREFIX
  var f = new Future;
  postcss([ autoprefixer(config.autoprefixer) ])
    .process(merged.code, {
      from:'merged-stylesheets.css',
      map: { inline: false, prev:  merged.sourceMap }
    })
    .then(function (result) {
      result.warnings().forEach(function (warn) {
        console.warn(warn.toString());
      });
      f.return(result);
    },function(err){
      files[0].error({
        message: err
      });
      f.throw(err);
    });
  var result = f.wait();
  //END AUTOPREFIX

  if (mode === 'development') {
    bless
      .chunk(result.css)
      .data
      .forEach(function(cssString, index) {
        files[0].addStylesheet({
          data: cssString,
          path: 'merged-stylesheets-' + index + '.css'
        });
      });

    return;
  }

  var minifiedFiles = CssTools.minifyCss(result.css);

  if (files.length) {
    minifiedFiles.forEach(function (minified) {
      bless
        .chunk(minified)
        .data
        .forEach(function(cssString, index) {
          files[0].addStylesheet({
            data: cssString
          });
        });

    });
  }
};

// Lints CSS files and merges them into one file, fixing up source maps and
// pulling any @import directives up to the top since the CSS spec does not
// allow them to appear in the middle of a file.
var mergeCss = Profile("mergeCss", function (css) {
  // Filenames passed to AST manipulator mapped to their original files
  var originals = {};

  var cssAsts = css.map(function (file) {
    var filename = file.getPathInBundle();
    originals[filename] = file;
    try {
      var parseOptions = { source: filename, position: true };
      var ast = CssTools.parseCss(file.getContentsAsString(), parseOptions);
      ast.filename = filename;
    } catch (e) {
      if (e.reason) {
        file.error({
          message: e.reason,
          line: e.line,
          column: e.column
        });
      } else {
        // Just in case it's not the normal error the library makes.
        file.error({message: e.message});
      }

      return { type: "stylesheet", stylesheet: { rules: [] },
        filename: filename };
    }

    return ast;
  });

  var warnCb = function (filename, msg) {
    // XXX make this a buildmessage.warning call rather than a random log.
    //     this API would be like buildmessage.error, but wouldn't cause
    //     the build to fail.
    console.log(filename + ': warn: ' + msg);
  };

  var mergedCssAst = CssTools.mergeCssAsts(cssAsts, warnCb);

  // Overwrite the CSS files list with the new concatenated file
  var stringifiedCss = CssTools.stringifyCss(mergedCssAst, {
    sourcemap: true,
    // don't try to read the referenced sourcemaps from the input
    inputSourcemaps: false
  });

  if (! stringifiedCss.code) {
    return { code: '' };
  }

  // Add the contents of the input files to the source map of the new file
  stringifiedCss.map.sourcesContent =
    stringifiedCss.map.sources.map(function (filename) {
      return originals[filename].getContentsAsString();
    });

  var newMap;

  Profile.time("composing source maps", function () {
    // If any input files had source maps, apply them.
    // Ex.: less -> css source map should be composed with css -> css source map
    newMap = sourcemap.SourceMapGenerator.fromSourceMap(
      new sourcemap.SourceMapConsumer(stringifiedCss.map));

    Object.keys(originals).forEach(function (name) {
      var file = originals[name];
      if (! file.getSourceMap())
        return;
      try {
        newMap.applySourceMap(
          new sourcemap.SourceMapConsumer(file.getSourceMap()), name);
      } catch (err) {
        // If we can't apply the source map, silently drop it.
        //
        // XXX This is here because there are some less files that
        // produce source maps that throw when consumed. We should
        // figure out exactly why and fix it, but this will do for now.
      }
    });
  });

  return {
    code: stringifiedCss.code,
    sourceMap: newMap.toString()
  };
});
