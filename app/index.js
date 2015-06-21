'use strict';

import angular from 'angular';
import controller from './controller.js'
import booth from '../modules/booth';

export default angular.module('photobooth', [booth.name])
.controller('appController', controller);
