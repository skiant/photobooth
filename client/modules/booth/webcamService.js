var getUserMedia = navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia;

if (getUserMedia) {
	getUserMedia = getUserMedia.bind(navigator);
}

let interval;

webcamService.$inject = ['$q', '$document', '$interval', '$rootScope'];
export default function webcamService($q, $document, $interval, $rootScope) {
	var def = $q.defer()

	let service = {
		// prepare internal elements
		timer: null,
		video: $document[0].createElement('video'),
		canvas: $document[0].createElement('canvas'),
		stream: def.promise,
		getFrames: getFrames,
		startTimer: startTimer
	}

	service.video.setAttribute('autoplay', true);
	service.canvas.width = 945;
	service.canvas.height = 945;
	let constraints = {
		audio: false,
		video: {
			mandatory: {
				minWidth: 1280,
				minHeight: 720
			}
		}
	};

	if (!getUserMedia) {
		console.error('Not possible to find user media');
		return false;
	} else {
		getUserMedia(
			constraints,
			stream => {
				service.video.src = window.URL.createObjectURL(stream)
				def.resolve(service.video.src);
			},
			error => { def.reject(error); }
		);
	}

	// record frames
	function getFrames (framesAmount, framesDelay, captureStartDelay) {
		captureStartDelay = captureStartDelay || 5000;
		let def = $q.defer();
		let frames = new Array(framesAmount);
		// prepare context
		let context = service.canvas.getContext('2d');

		// capture each frame
		frames.fill(0);
		service.startTimer(captureStartDelay);
		window.setTimeout(()=> {
			frames.forEach((frame, index) => {
				window.setTimeout(() => {
					// sending an event for the flash effect
					$rootScope.$broadcast('webcam-captured');

					// calculate size/position
					let newWidth = 1280 * (this.canvas.height / 720);
					let posX = (newWidth - this.canvas.width) / 2;
					context.drawImage(this.video, -367, 0, 1280 * (945/720), 945);
					frames[index] = service.canvas.toDataURL('image/jpg');

					// end the capture with the last frame
					if (index === frames.length-1) {
						def.resolve(frames);
					} else if (framesDelay > 1000){
						// show the timer if it's bigger than 1 second
						service.startTimer(framesDelay);
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

	// handles timer display
	function startTimer (delay) {
		$interval.cancel(interval);
		service.timer = delay/1000;
		interval = $interval(() => {}, 1000, service.timer);

		interval.then(
			()=>{ service.timer = null;},
			null,
			()=>{ if (service.timer > 0){ service.timer--; } }
		);
	}

	return service;
};
