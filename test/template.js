/*jshint esnext: true */
(function() {
  var fruits = ['apple', 'orange', 'apricot'];

  // Sample inner function.
  function talk(other) {
    'use strict';
    print(`template OK: ${other} ${fruits[0]}`);
  }

  talk('hello');
}());
