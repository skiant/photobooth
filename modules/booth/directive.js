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

webcamDirectiveController.$inject = ['$scope', 'webcamService', '$document', '$q'];
function webcamDirectiveController ($scope, webcamService, $document, $q) {
	let vm=this;
	vm.result = null;
	webcamService.stream.then(streamUrl => {
		vm.stream = streamUrl;
	});

	vm.capture = function () {
		switch(vm.type) {
			case 'fourframes':
				vm.result = vm.getFrames(4, 3000);
				break;
			case 'gif':
				vm.result = vm.getFrames(10, 500);
				break;
			default:
				vm.result = vm.getFrames(1);
				break;
		}
	}

	vm.getFrames = function (framesAmount, framesDelay) {
		let canvas;
		let context;
		let frames = new Array(framesAmount);
		let def = $q.defer();

		// create canvas
		canvas = $document[0].createElement('canvas');
		canvas.width = 1280;
		canvas.height = 720;

		// prepare context
		context = canvas.getContext('2d');

		// capture each frame
		frames.forEach((frame, index) => {
			context.drawImage(vm.videoElement, 0, 0, canvas.width, canvas.height);
			frames[index] = canvas.toDataURL('image/jpg');

			if (index === frames.length-1) {
				def.resolve(frames);
			}
		});

		return def.promise;
	}

	return vm;
}


function bindVideoElement (scope, elem, attr) {
	scope.booth.videoElement = elem.find('video')[0];
}
