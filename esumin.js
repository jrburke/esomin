try {
  var useReflector = false;

  if (useReflector) {
    // load('esmangle.fixed.js');
    load('escodegen.browser.fixed.js');
  } else {
    load('esprima.js');
    // load('esmangle.js');
    load('escodegen.browser.js');
  }

  Components.utils['import']('resource://gre/modules/FileUtils.jsm');

  var Cc = Components.classes,
      Ci = Components.interfaces,
      isWindows = ('@mozilla.org/windows-registry-key;1' in Cc);

  function mkFullDir(dirObj) {
    //1 is DIRECTORY_TYPE, 511 is 0777 permissions
    if (!dirObj.exists()) {
      dirObj.create(1, 511);
    }
  }

  function cwd() {
      return FileUtils.getFile("CurWorkD", []).path;
  }

  //Remove . and .. from paths, normalize on front slashes
  function normalize(path) {
      //There has to be an easier way to do this.
      var i, part, ary,
          firstChar = path.charAt(0);

      if (firstChar !== '/' &&
              firstChar !== '\\' &&
              path.indexOf(':') === -1) {
          //A relative path. Use the current working directory.
          path = cwd() + '/' + path;
      }

      ary = path.replace(/\\/g, '/').split('/');

      for (i = 0; i < ary.length; i += 1) {
          part = ary[i];
          if (part === '.') {
              ary.splice(i, 1);
              i -= 1;
          } else if (part === '..') {
              ary.splice(i - 1, 2);
              i -= 2;
          }
      }
      return ary.join('/');
  }

  function xpfile(path) {
    var fullPath;
    try {
      fullPath = normalize(path);
      if (isWindows) {
          fullPath = fullPath.replace(/\//g, '\\');
      }
      return new FileUtils.File(fullPath);
    } catch (e) {
      throw new Error((fullPath || path) + ' failed: ' + e);
    }
  }


  function saveFile(fileName, fileContents, encoding) {
    var outStream, convertStream,
        fileObj = xpfile(fileName);

    encoding = encoding || 'utf-8';

    mkFullDir(fileObj.parent);

    try {
      outStream = Cc['@mozilla.org/network/file-output-stream;1']
                   .createInstance(Ci.nsIFileOutputStream);
      //438 is decimal for 0777
      outStream.init(fileObj, 0x02 | 0x08 | 0x20, 511, 0);

      convertStream = Cc['@mozilla.org/intl/converter-output-stream;1']
                        .createInstance(Ci.nsIConverterOutputStream);

      convertStream.init(outStream, encoding, 0, 0);
      convertStream.writeString(fileContents);
    } catch (e) {
      throw new Error((fileObj && fileObj.path || '') + ': ' + e);
    } finally {
      if (convertStream) {
          convertStream.close();
      }
      if (outStream) {
          outStream.close();
      }
    }
  }


  function readFile(path, encoding) {
    //A file read function that can deal with BOMs
    encoding = encoding || "utf-8";

    var inStream, convertStream,
        readData = {},
        fileObj = xpfile(path);

    //XPCOM, you so crazy
    try {
      inStream = Cc['@mozilla.org/network/file-input-stream;1']
                 .createInstance(Ci.nsIFileInputStream);
      inStream.init(fileObj, 1, 0, false);

      convertStream = Cc['@mozilla.org/intl/converter-input-stream;1']
                      .createInstance(Ci.nsIConverterInputStream);
      convertStream.init(inStream, encoding, inStream.available(),
      Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);

      convertStream.readString(inStream.available(), readData);
      return readData.value;
    } catch (e) {
      throw new Error((fileObj && fileObj.path || '') + ': ' + e);
    } finally {
      if (convertStream) {
          convertStream.close();
      }
      if (inStream) {
          inStream.close();
      }
    }
  }

  var filePath = cwd() + '/' + arguments[0],
      outPath = arguments[1] && cwd() + '/' + arguments[1];

  if (!filePath) {
    throw new Error('Pass file name to minify');
  }

  //print('File path is: ' + filePath);

  var fileContents = readFile(filePath);
  var ast = (useReflector ? Reflect : esprima).parse(fileContents);

  //print('REFLECT AST:\n' + JSON.stringify(ast, null, '  '));

  // Having trouble with 1.0.1 of esmangle, and escodgen seems to be able to
  // do some shortening on its own.
  var result = ast; //esmangle.mangle(ast);
  //print('ESMANGLE RESULT:\n' + JSON.stringify(result, null, '  '));

  var minified = escodegen.generate(result, {
    format: {
      compact: true
    }
  });

  if (outPath) {
    saveFile(outPath, minified);
  } else {
    print(minified);
  }
} catch(e) {
  print('ERROR: ' + e + '. Line ' +
        e.lineNumber + ', column ' + e.columnNumber);
}

