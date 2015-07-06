'use strict';

export default appController;

appController.$inject = ['$scope'];
function appController ($scope) {
	let vm = this;
	vm.mode="single";
	return vm;
}
