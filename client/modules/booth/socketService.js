import io from 'socket.io-client';

class socketService {
	constructor ($rootScope) {
		this.socket = io.connect();
		this.$rootScope = $rootScope;
	}

	on (eventName, callback) {
		this.socket.on(eventName, () => {
			let args = arguments;
			this.$rootScope.$apply(() => { callback.apply(this.socket, args); });
		});
	}

	emit (eventName, data, callback) {
		this.socket.emit(eventName, data, () => {
			var args = arguments;
			this.$rootScope.$apply(() => {
				if (callback) {
					callback.apply(this.socket, args);
				}
			});
		})
	}
}

socketService.$inject = ['$rootScope'];
export default socketService;
