var getUserMedia = navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia;

if (getUserMedia) {
	getUserMedia = getUserMedia.bind(navigator);
}

class webcamService {
	constructor ($q) {
		var def = $q.defer()
		this.stream = def.promise;

		if (!getUserMedia) {
			console.error('Not possible to find user media');
			return false;
		}

		let constraints = {
			audio: false,
			video: {
				mandatory: {
					minWidth: 1280,
					minHeight: 720
				}
			}
		};

		getUserMedia(
			constraints,
			stream => {
				def.resolve(window.URL.createObjectURL(stream));
			},
			error => {
				def.reject(error);
			}
		);
	}

	// TODO: Record one frame
	getFrame () {

	}
}
webcamService.$inject = ['$q'];
export default webcamService;
