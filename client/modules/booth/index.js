'use strict';

import angular from 'angular';
import directive from './directive.js';
import webcamService from './webcamService.js';
import socketService from './socketService.js';

export default angular.module('booth', [])
.directive('booth', directive)
.service('webcamService', webcamService)
.service('socketService', socketService)
.config(allowVideoSrc);

// Configure Angular's Strict Escaping to allow glob URLs as Source
allowVideoSrc.$inject = ['$sceDelegateProvider'];
function allowVideoSrc ($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
		'self',
		'blob:http%3A//localhost%3A*/**'
	]);
}
