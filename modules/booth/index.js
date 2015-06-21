'use strict';

import angular from 'angular';
import directive from './directive.js';
import service from './service.js';

export default angular.module('booth', [])
.directive('booth', directive)
.service('webcamService', service)
.config(allowVideoSrc);

allowVideoSrc.$inject = ['$sceDelegateProvider'];
function allowVideoSrc ($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
		'self',
		'blob:**'
	]);
}
