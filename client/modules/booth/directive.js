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
		}
	}
}

webcamDirectiveController.$inject = ['$scope', 'webcamService', 'socketService', 'templateCompositionService',  '$document', '$q'];
function webcamDirectiveController ($scope, webcamService, socket, template, $document, $q) {
	let vm=this;
	vm.result = null;
	vm.webcam = webcamService;
	vm.capture = startCapture;
	vm.flash = false;

	webcamService.stream.then(streamUrl => {
		vm.stream = streamUrl;
	});

	$scope.$on('webcam-captured', () => {
		$document[0].body.classList.add('flash');
		window.setTimeout(()=>{$document[0].body.classList.remove('flash');}, 300);
	});

	let canvas = $document[0].createElement('canvas');
	canvas.width = 945;
	canvas.height = 945;
	let imgContainer = $document[0].createElement('img');
	let context = canvas.getContext('2d');

	let fourFramesPositions = [
		{x: 0, y:0},
		{x: canvas.width/2, y: 0},
		{x: 0, y: canvas.height/2},
		{x: canvas.width/2, y: canvas.height/2}
	]


	function startCapture () {
		vm.result = null;
		switch(vm.type) {
			case 'fourframes':
				webcamService.getFrames(4, 3000).then(template.composeFourFrames).then(img => {
					vm.result = img;
					socket.emit('save-pic', vm.result);
				});
				break;
			case 'gif':
				webcamService.getFrames(10, 500).then(frames => {

				});
				break;
			default:
				webcamService.getFrames(1).then(template.composeSingle).then(img => {
					vm.result = img;
					socket.emit('save-pic', vm.result);
				});
				break;
		}
	}
	return vm;
}
