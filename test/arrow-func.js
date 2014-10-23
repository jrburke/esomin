/*jshint esnext: true */

// This is a test file with a comment.
var start = 'something';

var talk = (other) => {
  'use strict';
  print('arrow-func OK: ' + other + ' ' + start);
};

talk('hello');
