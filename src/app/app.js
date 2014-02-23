'use strict';

if (document.location.host === 'www.bountysource.com') {
  window.BS_ENV = 'prod';
} else {
  window.BS_ENV = 'staging';
}

angular.module('app', ['ngRoute', 'ngSanitize', 'ngCookies', 'ui.bootstrap', 'colorpicker.module'])
  .config(function ($locationProvider, $httpProvider, $provide) {
    //  NOTE: uncomment to test_old hashbang # mode
    //  $provide.decorator('$sniffer', function($delegate) { $delegate.history = false; return $delegate; });

    $locationProvider.html5Mode(true);

    // HACK: transform old-style #urls into new style #/urls
    if ((window.location.hash||'').match(/^#[^/]/)) {
      window.location.hash = '#/' + window.location.hash.replace(/^#/,'');
    }

    // CORS support
    $provide.decorator('$sniffer', function($delegate) { $delegate.cors = true; return $delegate; });
    // HACK: angular 1.0 adds this bad header... not needed in 1.1 per https://github.com/angular/angular.js/pull/1454
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })

  .run(function($api) {
    // load person from initial cookies
    $api.load_current_person_from_cookies();
  });