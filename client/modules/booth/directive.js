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
		scope: {}
	}
}

webcamDirectiveController.$inject = ['$scope', 'webcamService', 'socketService', 'templateCompositionService',  '$document', '$q'];
function webcamDirectiveController ($scope, webcamService, socket, template, $document, $q) {
	let vm=this;
	vm.result = null;
	vm.webcam = webcamService;
	vm.capture = startCapture;
	vm.sendMail = sendMail;
	vm.flash = false;
	vm.type = 'single';
	vm.email = '';

	webcamService.stream.then(streamUrl => {
		vm.stream = streamUrl;
	});

	$scope.$on('webcam-captured', () => {
		$document[0].body.classList.add('flash');
		window.setTimeout(()=>{$document[0].body.classList.remove('flash');}, 300);
	});

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

	function sendMail () {
		socket.emit('mail-pic', {email: vm.email, image: vm.result});
	}
	return vm;
}
