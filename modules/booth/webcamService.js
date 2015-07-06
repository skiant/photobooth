var getUserMedia = navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia;

if (getUserMedia) {
	getUserMedia = getUserMedia.bind(navigator);
}

class webcamService {
	constructor ($q, $document) {
		var def = $q.defer()

		// prepare internal elements
		this.video = $document[0].createElement('video');
		this.video.setAttribute('autoplay', true);
		this.canvas = $document[0].createElement('canvas');
		this.canvas.width = 1280;
		this.canvas.height = 720;
		this._timer = 0;
		this.$q = $q;

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
				this.video.src = window.URL.createObjectURL(stream)
				def.resolve(this.video.src);
			},
			error => {
				def.reject(error);
			}
		);
	}

	// Record frames
	getFrames (framesAmount, framesDelay, captureStartDelay) {
		captureStartDelay = captureStartDelay || 5000;
		let def = this.$q.defer();
		let frames = new Array(framesAmount);
		// prepare context
		let context = this.canvas.getContext('2d');

		// capture each frame
		frames.fill(0);
		window.setTimeout(()=> {
			frames.forEach((frame, index) => {
				window.setTimeout(() => {
					context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
					frames[index] = this.canvas.toDataURL('image/jpg');

					// end the capture with the last frame
					if (index === frames.length-1) {
						def.resolve(frames);
					}
				},
				framesDelay
				);

			});
		},
		captureStartDelay
		);


		return def.promise;
	}
}
webcamService.$inject = ['$q', '$document'];
export default webcamService;
