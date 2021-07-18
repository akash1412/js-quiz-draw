import fireStoreDB from '../lib/firebase.config.js';
import { TakeSnapshot } from './helper.js';

const restart = document.querySelector('.container');

const timerDisplay = document.querySelector('.timer-label');

let isOverlayOpen = false;

let startDrawing = false;
let count = 20;

//TODO after game over display page clear the last drawings for the next round
let animation = bodymovin.loadAnimation({
	container: document.querySelector('#svg'), // Required
	path: 'https://assets6.lottiefiles.com/packages/lf20_pkanqwys.json', // Required
	renderer: 'svg', // Required
	loop: false,
});

animation.addEventListener('complete', () => {
	document.querySelector('#svg').style.display = 'none';
});

let sketch = function (p) {
	const questions = ['line', 'stitches', 'circle', 'cat', 'castle'];
	let curQuesIndexCount = 0;
	let startBtn = p.select('.start-questions');
	let questionPlaceholder = p.select('.question-placeholder');
	let headerQuestionDisplay = p.select('.header-question-display');
	let parentContainer = p.select('#drawing-container');
	let EraseBtn = p.select('.erase');
	let startDrawingBtn = p.select('.start-drawing');
	let footer = p.select('#footer');
	let classifier;
	let canvas;
	let timerId;
	let skipQuestion = p.select('.skip');
	let quitGame = p.select('.quit');
	let speectBot; // speech synthesis object
	// let gameOverPage = p.select(".game-over-page");
	let resumeBtn = p.select('.dont-quit');
	let confirmQuitGameBtn = p.select('.confirm-quit-game');
	let quitPage = document.querySelector('.quit-page');
	let pauseTimer = false;
	let loadingElement = document.querySelector('.listening-icon');
	let responseLabel = p.select('.response-label');
	let gameOverBtn = p.select('.game-over-page-btn ');

	// DOM selectors
	let homePage = document.querySelector('#home-page');
	let OverlayPage = document.querySelector('.overlay');
	let currentQuestionPlaceholder = document.querySelector(
		'.current-question-number'
	);
	let gameOverPage = document.querySelector('.game-over-page');
	let ImagesContainer = document.querySelector('.images-container');

	let closeAlertBtn = document.querySelector('.alert-close-btn');
	let DrawingContainer = document.querySelector('#drawing-container');

	const handleOverlayAction = () => {
		if (!isOverlayOpen) {
			OverlayPage.classList.add('open-overlay');
		} else {
			OverlayPage.classList.remove('open-overlay');
		}
		isOverlayOpen = !isOverlayOpen;
	};

	function handleClearSpeechBot() {
		speectBot.cancel();
	}

	startBtn.mousePressed(() => {
		updateQuestion();
		handleOverlayAction();
	});

	startDrawingBtn.mousePressed(handleStartBtn);

	skipQuestion.mousePressed(handleSkipQuestionEvent);

	// !TODO Refactor resetOption func with clearCanvasAndCloseContainer func
	const resetOptions = () => {
		homePage.classList.remove('close-home-page');

		clearTimer(timerId);
		clearImages();
		clearCanvas();
		startDrawing = false;

		pauseTimer = false;

		curQuesIndexCount = 0;
		count = 20;
	};

	//* resume game
	resumeBtn.mousePressed(() => {
		quitPage.style.display = 'none';

		setTimeout(() => {
			pauseTimer = false;
			startDrawing = true;
		}, 500);
	});

	//* confirm quit game Btn
	confirmQuitGameBtn.mousePressed(() => {
		quitPage.style.display = 'none';
		resetOptions();
	});

	gameOverBtn.mousePressed(() => {
		gameOverPage.classList.remove('show-game-over-page');
		resetOptions();
	});

	//* quit game button on drawing page
	quitGame.mousePressed(() => {
		quitPage.style.display = 'block';

		pauseTimer = true;
		startDrawing = false;
	});

	function clearImages() {
		ImagesContainer.innerHTML = '';
	}

	function handleSkipQuestionEvent() {
		console.log();
		captureImage();
	}

	function updateQuestion() {
		questionPlaceholder.html(` ${questions[curQuesIndexCount]}`);
		headerQuestionDisplay.html(`${questions[curQuesIndexCount]}`);
		currentQuestionPlaceholder.textContent = `Drawing ${
			curQuesIndexCount + 1 + ' / ' + questions.length
		}`;
	}

	function updateTimerDisplay(count) {
		timerDisplay.innerHTML = `${count}`.padStart(2, 0);
	}

	function clearTimer(timerId) {
		clearInterval(timerId);
	}

	function timerFunction() {
		if (count === 0) {
			clearTimer(timerId);
			console.log(canvas);
			captureImage();
		} else {
			if (pauseTimer) {
				return;
			} else {
				count--;
				updateTimerDisplay(count);
			}
		}
	}

	//---------------------------------------------------
	function startTimer() {
		timerFunction();
		timerId = setInterval(timerFunction, 1000);
	}

	async function captureImage() {
		const newDrawing = await TakeSnapshot(
			document.querySelector('#drawing-container'),
			questions[curQuesIndexCount]
		);

		ImagesContainer.insertAdjacentElement('beforeend', newDrawing);

		closeDrawingContainerAndClearCanvas();
	}

	function handleStartBtn() {
		updateTimerDisplay(20);
		handleOverlayAction();
		homePage.classList.add('close-home-page');

		// timeout function to not start drawing on canvas immediately
		setTimeout(() => {
			startDrawing = true; // required condition to draw to draw on canvas

			startTimer();
		}, 1000);
	}

	function handleGameOverEvent() {
		gameOverPage.classList.add('show-game-over-page');
	}

	// preload loads all the required external files
	p.preload = function () {
		classifier = ml5.imageClassifier('DoodleNet');
		speectBot = new p5.Speech();
	};

	// setup function runs only one time
	p.setup = function () {
		// setting canvas width & height
		canvas = p.createCanvas(
			parentContainer.elt.offsetWidth,
			parentContainer.elt.offsetHeight
		);
		p.background(255);

		EraseBtn.mousePressed(clearCanvas);

		canvas.mouseReleased(classifyCanvas);
	};

	p.draw = function () {
		p.strokeWeight(8);

		p.stroke(0);

		if (p.mouseIsPressed && startDrawing) {
			console.log('drawing...');

			p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
		}
	};

	p.windowResized = function () {
		p.resizeCanvas(
			parentContainer.elt.offsetWidth,
			parentContainer.elt.offsetHeight
		);
	};

	function classifyCanvas() {
		if (startDrawing) {
			classifier.classify(canvas, gotResult);
		}
	}

	function gotResult(error, results) {
		if (error) {
			console.error(error);
		}

		loadingElement.classList.add('hide-listening-icon');

		speectBot.speak(`I see ${results[0].label}`);
		responseLabel.html(`I see: ${results[0].label}`);

		questions[curQuesIndexCount] === results[0].label && captureImage();
	}

	function clearCanvas() {
		p.background(255);

		loadingElement.classList.remove('hide-listening-icon');
		responseLabel.html('');
		handleClearSpeechBot();
	}

	function closeDrawingContainerAndClearCanvas() {
		startDrawing = false;
		clearTimer(timerId);

		count = 20;
		curQuesIndexCount += 1;

		if (curQuesIndexCount <= questions.length - 1) {
			handleOverlayAction();
			updateQuestion();
		} else {
			handleGameOverEvent();
		}

		clearCanvas();
	}
};

// creating new p5 instance
new p5(sketch, 'drawing-container');
