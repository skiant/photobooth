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

webcamDirectiveController.$inject = ['$scope', 'webcamService'];
function webcamDirectiveController ($scope, webcamService) {
	var vm=this;
	webcamService.stream.then(streamUrl => {
		vm.stream = streamUrl;
	});
	return vm;
}
