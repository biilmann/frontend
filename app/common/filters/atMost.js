'use strict';

angular.module('bountysource.filters').filter('atMost', function() {
  return function (input, other) {
    return (input < other) ? input : other;
  };
});