const restart = document.querySelector(".container");

const timerDisplay = document.querySelector(".timer-display");

let isOverlayOpen = true;

let startDrawing = false;
let count = 20;

const questions = ["Bat", "ball", "smiley"];

// startBtn.addEventListener("click", () => {
// 	document.querySelector("#home-page").style.height = "0%";
// });

const handleOverlayAction = () => {
	if (!isOverlayOpen) {
		document.querySelector(".overlay").style.height = "0%";
	} else {
		document.querySelector(".overlay").style.height = "100%";
	}
};

let sketch = function (p) {
	let curQuesIndexCount = 0;
	let startBtn = p.select(".start-questions");
	let questionPlaceholder = p.select(".question-placeholder");
	let headerQuestionDisplay = p.select(".header-question-display");
	let parentContainer = p.select("#drawing-container");
	let EraseBtn = p.select(".erase");
	let startDrawingBtn = p.select(".start-drawing");
	let footer = p.select("#footer");
	let classifier;
	let canvas;
	let timerId;
	let skipQuestion = p.select(".skip");
	let quitGame = p.select(".quit");
	let speectBot; // speech synthesis object
	// let gameOverPage = p.select(".game-over-page");
	let confirmDontQuitBtn = p.select(".dont-quit");
	let confirmQuitGameBtn = p.select(".confirm-quit-game");
	let quitPage = document.querySelector(".quit-page");
	let pauseTimer = false;
	let loadingElement = document.querySelector(".listening-icon");
	let responseLabel = p.select(".response-label");

	// HTML selectors
	let homePage = document.querySelector("#home-page");
	let OverlayPage = document.querySelector(".overlay");
	let gameOverPage = document.querySelector(".game-over-page");
	let OverlayCloseBtn = document.querySelector(".close-overlay-container");

	function closePage(selector, cssClass) {
		selector.classList.remove(`${cssClass}`);
	}

	function openPage(selector, cssClass) {
		selector.classList.add(`${cssClass}`);
	}

	questionPlaceholder.html(`${questions[curQuesIndexCount]}`);
	headerQuestionDisplay.html(`${questions[curQuesIndexCount]}`);

	startBtn.mousePressed(() => {
		OverlayPage.classList.add("open-overlay");
	});

	console.log(OverlayCloseBtn);

	OverlayCloseBtn.addEventListener("click", () => {
		homePage.classList.remove("close-home-page");
		closePage(OverlayPage, "open-overlay");
	});

	startDrawingBtn.mousePressed(handleStartBtn);

	skipQuestion.mousePressed(handleSkipQuestionEvent);

	//* continue game game btn on quit Page
	confirmDontQuitBtn.mousePressed(() => {
		quitPage.style.display = "none";
		pauseTimer = false;
		startDrawing = true;
	});

	//* confirm quit game Btn
	confirmQuitGameBtn.mousePressed(() => {
		quitPage.style.display = "none";
		homePage.classList.remove("close-home-page");
	});

	//* quit game button on drawing page
	quitGame.mousePressed(() => {
		quitPage.style.display = "block";
		pauseTimer = true;
		startDrawing = false;
	});

	function handleSkipQuestionEvent() {
		closeDrawingContainerAndClearCanvas();
	}

	function updateQuestion() {
		questionPlaceholder.html(` ${questions[curQuesIndexCount]}`);
		headerQuestionDisplay.html(`${questions[curQuesIndexCount]}`);
	}

	function updateTimerDisplay(count) {
		timerDisplay.innerHTML =
			// count % 10 === 0 && count !== 10 ? `00:0${count}` : `00:${count}`;
			count < 10 ? `00:0${count}` : `00:${count}`;
	}

	function resetTimer(timerId) {
		clearInterval(timerId);
	}

	//---------------------------------------------------
	function startTimer() {
		timerId = setInterval(timerFunction, 1000);

		function timerFunction() {
			if (count === 0) {
				closeDrawingContainerAndClearCanvas();
			} else {
				if (pauseTimer) {
					return;
				} else {
					count--;
					updateTimerDisplay(count);
				}
			}
		}
	}

	function handleStartBtn() {
		homePage.classList.add("close-home-page");
		isOverlayOpen = false;
		handleOverlayAction();
		setTimeout(() => {
			startDrawing = true;
			startTimer();
		}, 100);
		// p.background(180);
	}

	// handleStartBtn();

	function handleGameOverEvent() {
		gameOverPage.classList.add("show-game-over-page");
	}

	p.preload = function () {
		classifier = ml5.imageClassifier("DoodleNet");
		speectBot = new p5.Speech();
	};

	p.setup = function () {
		canvas = p.createCanvas(
			parentContainer.elt.offsetWidth,
			parentContainer.elt.offsetHeight
		);
		p.background(255);

		EraseBtn.mousePressed(clearCanvas);

		canvas.mouseReleased(classifyCanvas);
		// footer.html("...");
		// footer.appendChild(loadingElement);
	};

	p.draw = function () {
		p.strokeWeight(8);

		p.stroke(0);

		if (p.mouseIsPressed && startDrawing) {
			p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
		}
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

		loadingElement.classList.add("hide-listening-icon");

		responseLabel.html(
			`I see: ${results[0].label}, ${results[1].label}, ${results[2].label}`
		);

		results.slice(0, 3).forEach(res => {
			speectBot.speak(res.label);
		});
	}

	function clearCanvas() {
		p.background(255);

		loadingElement.classList.remove("hide-listening-icon");
		responseLabel.html("");
		speectBot.cancel();
	}

	function closeDrawingContainerAndClearCanvas() {
		isOverlayOpen = true;
		startDrawing = false;
		count = 20;
		curQuesIndexCount++; // 1 // 2
		if (curQuesIndexCount <= 2) {
			updateQuestion();
			handleOverlayAction();
		} else {
			handleGameOverEvent();
		}

		// if (curQuesIndexCount <= 1) {
		// 	console.log(curQuesIndexCount, questions.length - 2);
		// 	updateQuestion();
		// 	console.log("true");
		// } else {
		// 	handleGameOverEvent();
		// 	console.log("false");
		// }
		// if (curQuesIndexCount <= questions.length - 2) handleOverlayAction();
		updateTimerDisplay(0);

		clearCanvas();
		resetTimer(timerId);
	}
};

new p5(sketch, "drawing-container");
