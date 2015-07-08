templateCompose.$inject = ['$q', '$document'];
export default function templateCompose($q, $document) {
	let service = {
		composeSingle: singleFrame,
		composeFourFrames: fourFrames
	};

	// set up internals - base template
	let template = $document[0].createElement('img');
	template.src = '/img/template.jpg';
	template.width = 1181;
	template.height = 1748;
	// set up internals - manipulation canvas
	let canvas = $document[0].createElement('canvas');
	canvas.width = template.width;
	canvas.height = template.height;

	let context = canvas.getContext('2d');

	// set up internals - insert the template
	template.addEventListener('load', () => {
		context.drawImage(template, 0, 0, canvas.width, canvas.height);
	})

	let imgContainer = $document[0].createElement('img');

	function singleFrame (frame) {
		if (Array.isArray(frame)) {
			frame = frame[0];
		}

		let def = $q.defer();

		imgContainer.src = frame;
		context.drawImage(imgContainer, 118, 118, 945, 945);
		def.resolve(canvas.toDataURL('image/jpg'));

		return def.promise;
	}

	function fourFrames(frames) {
		let def = $q.defer();

		let positions = [
			{x: 118, y: 118},
			{x: 118+945/2, y: 118},
			{x: 118, y: 118+945/2},
			{x: 118+945/2, y: 118+945/2}
		]

		frames.forEach((frame, index) => {
			imgContainer.setAttribute('src', frame);
			context.drawImage(imgContainer, positions[index].x, positions[index].y, 945/2, 945/2);
		})

		def.resolve(canvas.toDataURL('image/jpg'));

		return def.promise;
	}

	return service;
};
