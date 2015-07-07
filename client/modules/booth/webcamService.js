var getUserMedia = navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia;

if (getUserMedia) {
	getUserMedia = getUserMedia.bind(navigator);
}

let interval;

class webcamService {
	constructor ($q, $document, $interval) {
		var def = $q.defer()

		// prepare internal elements
		this.timer = null;
		this.video = $document[0].createElement('video');
		this.video.setAttribute('autoplay', true);
		this.canvas = $document[0].createElement('canvas');
		this.canvas.width = 945;
		this.canvas.height = 945;
		this.$q = $q;
		this.$interval = $interval;

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
		this.startTimer(captureStartDelay);
		window.setTimeout(()=> {
			frames.forEach((frame, index) => {
				window.setTimeout(() => {
					let newWidth = 1280 * (this.canvas.height / 720);
					let posX = (newWidth - this.canvas.width) / 2;
					context.drawImage(this.video, -367, 0, 1280 * (945/720), 945);
					frames[index] = this.canvas.toDataURL('image/jpg');

					// end the capture with the last frame
					if (index === frames.length-1) {
						def.resolve(frames);
					} else if (framesDelay > 1000){
						// show the timer if it's bigger than 1 second
						this.startTimer(framesDelay);
					}
				},
				framesDelay * index + 1
				);

			});
		},
		captureStartDelay
		);

		return def.promise;
	}

	startTimer (delay) {
		this.$interval.cancel(interval);
		this.timer = delay/1000;
		interval = this.$interval(() => {}, 1000, this.timer);

		interval.then(
			()=>{ this.timer = null;},
			null,
			()=>{ if (this.timer > 0){ this.timer--; } }
		);
	}
}
webcamService.$inject = ['$q', '$document', '$interval'];
export default webcamService;
