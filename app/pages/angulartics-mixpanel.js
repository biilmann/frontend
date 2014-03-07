'use strict';

angular.module('angulartics.mixpanel', ['angulartics'])
  .config(['$analyticsProvider', function ($analyticsProvider) {
    angulartics.waitForVendorApi('mixpanel', 500, function (mixpanel) {
      $analyticsProvider.registerEventTrack(function (action, properties) {
        mixpanel.track(action, properties);
      });
    });
  }]);

angular.module('app').service('mixpanelEvent', function($location, $analytics) {

  /*
  * Generic page view. Sends path and any search params from $location
  * */
  this.pageView = function(options) {
    options = options || {};
    var payload = this._buildPayload(options);
    $analytics.eventTrack('Page View', payload);
  };

  /*
   * Track Issue view
   * */
  this.issueView = function(id, options) {
    options = options || {};
    var payload = this._buildPayload(angular.extend({ id: id }, options));
    $analytics.eventTrack('Issue View', payload);
  };

  /*
   * Track Fundraiser view
   * */
  this.fundraiserView = function(id, options) {
    options = options || {};
    var payload = this._buildPayload(angular.extend({ id: id }, options));
    $analytics.eventTrack('Fundraiser View', payload);
  };

  /*
  * Track Tracker view
  * */
  this.trackerView = function(id, options) {
    options = options || {};
    var payload = this._buildPayload(angular.extend({ id: id }, options));
    $analytics.eventTrack('Tracker View', payload);
  };

  /*
   * Start the Bounty placement process.
   * */
  this.bountyStart = function(options) {
    options = options || {};
    var payload = this._buildPayload(angular.extend({ type: '$direct' }, options));
    $analytics.eventTrack('Bounty Start', payload);
  };

  /*
   * Start the Pledge placement process.
   * */
  this.pledgeStart = function(options) {
    options = options || {};
    var payload = this._buildPayload(angular.extend({ type: '$direct' }, options));
    $analytics.eventTrack('Pledge Start', payload);
  };

  /*
  * Build payload to send to Mixpanel.
  * Adds page param to all events with the current path.
  * */
  this._buildPayload = function(options) {
    options = options || {};
    var payload = angular.extend({ page: $location.path() }, options);
    return payload;
  };


  this.plegeCreate = function (options) {
    options = options || {};
    var payload = angular.extend({ type: 'Personal Balance'}, options)
    $analytics.eventTrack('Pledge Create', payload);
  };

});


/*
* Fire Mixpanel events based on route
* */
angular.module('app')
  .run(function($rootScope, $location, mixpanelEvent) {

    $rootScope.$on('$routeChangeSuccess', function(routeChangeEvent, currentRoute) {
      var path = $location.path();

      /*
       * Issue show page views
       * */
      if (/^\/issues.+/.test(path)) {
        mixpanelEvent.issueView(currentRoute.params.id);
      }

      /*
      * Fundraiser show page views
      * */
      else if (/^\/fundraisers.+/.test(path)) {
        mixpanelEvent.fundraiserView(currentRoute.params.id);
      }

      /*
      * Tracker show page view
      * */
      else if (/^\/trackers.+/.test(path)) {
        mixpanelEvent.trackerView(currentRoute.params.id);
      }

      /*
      * Track generic page view if none of the above
      * */
      else {
        mixpanelEvent.pageView();
      }

    });

  });