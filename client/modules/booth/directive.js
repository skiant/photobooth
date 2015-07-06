// grab the Babel Polyfill
require("babel/polyfill");

import template from './template.html';

export default function () {
	return {
		restrict: 'AE',
		controller: webcamDirectiveController,
		bindToController: true,
		controllerAs: 'booth',
		replace: true,
		template: template,
		scope: {
			type: '='
		},
		link: bindVideoElement
	}
}

webcamDirectiveController.$inject = ['$scope', 'webcamService', 'socketService', '$document', '$q'];
function webcamDirectiveController ($scope, webcamService, socket, $document, $q) {
	let vm=this;
	vm.result = null;
	vm.webcam = webcamService;
	vm.capture = startCapture;
	vm.save = saveResult;

	webcamService.stream.then(streamUrl => {
		vm.stream = streamUrl;
	});

	function startCapture () {
		switch(vm.type) {
			case 'fourframes':
				webcamService.getFrames(4, 3000).then(frames => {

				});
				break;
			case 'gif':
				webcamService.getFrames(10, 500).then(frames => {

				});
				break;
			default:
				webcamService.getFrames(1).then(frames => {
					vm.result = frames[0];
				});
				break;
		}
	}

	function saveResult () {
		switch (vm.type) {
			default:
				socket.emit('single-pic', vm.result);
				break;
		}
	}
	return vm;
}


function bindVideoElement (scope, elem, attr) {
	scope.booth.videoElement = elem.find('video')[0];
}
