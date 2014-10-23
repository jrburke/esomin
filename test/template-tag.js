/*jshint esnext: true */
(function() {
  var a = 5;
  var b = 10;

  function tag(strings, ...values) {
    return strings.map(function(segment, i) {
      return segment.toUpperCase() + (values[i] || '');
    }).join('');
  }

  function talk(other) {
    print(tag`template-tag OK: ${other} ${ a + b } world ${ a * b }`);
  }

  talk('hello');
}());
