// This script expects to be run in node

var fs = require('fs'),
    arrowRegExp = /ArrowFunctionExpression/g,
    filePath = process.argv[process.argv.length - 1];

if (!filePath) {
  throw new Error('Pass file name to script');
}

console.log('modifying: ' + filePath);

var contents = fs.readFileSync(filePath, 'utf8');

// Even though there are plans to convert Reflect.parse to use
// ArrowFunctionExpression:
// https://bugzilla.mozilla.org/show_bug.cgi?id=913617
// in the meantime, just modify the files to use ArrowExpression.
contents = contents.replace(arrowRegExp, 'ArrowExpression');

fs.writeFileSync(filePath.replace(/\.js$/, '.fixed.js'), contents, 'utf8');
