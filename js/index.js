const restart = document.querySelector(".container");

const timerDisplay = document.querySelector(".timer-display");

const closeDrawing = document.querySelector(".close");

let isOverlayOpen = true;

let startDrawing = false;
let count = 0;

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

closeDrawing.addEventListener("click", () => {
	isOverlayOpen = true;
	handleOverlayAction();
});

let sketch = function (p) {
	let curQuesIndexCount = 0;
	let startBtn = p.select(".start-questions");
	let questionDisplay = p.select(".display-question");
	let headerQuestionDisplay = p.select(".header-question-display");
	let parentContainer = p.select("#drawing-container");
	let EraseBtn = p.select(".erase");
	let startDrawingBtn = p.select(".start-drawing");
	let footer = p.select("#footer");
	let closeDrawing = p.select(".close");
	let classifier;
	let canvas;
	let timerId;
	let skipQuestion = p.select(".skip");
	let speectBot = new p5.Speech(); // speech synthesis object
	let gameOverPage = p.select(".game-over-page");

	questionDisplay.html(`Draw a ${questions[curQuesIndexCount]}`);
	headerQuestionDisplay.html(`${questions[curQuesIndexCount]}`);

	startBtn.mousePressed(() => {
		document.querySelector("#home-page").style.display = "none";
	});

	startDrawingBtn.mousePressed(handleStartBtn);

	skipQuestion.mousePressed(handleSkipQuestionEvent);

	function handleSkipQuestionEvent() {
		closeDrawingContainerAndClearCanvas();
	}

	function updateQuestion() {
		questionDisplay.html(`Draw a ${questions[curQuesIndexCount]}`);
		headerQuestionDisplay.html(`${questions[curQuesIndexCount]}`);
	}

	function updateTimerDisplay(count) {
		timerDisplay.innerHTML =
			count % 10 === 0 && count !== 10 ? `00:0${count}` : `00:${count}`;
	}

	function resetTimer(timerId) {
		clearInterval(timerId);
	}

	//---------------------------------------------------
	function startTimer() {
		timerId = setInterval(timerFunction, 1000);

		function timerFunction() {
			if (count === 20) {
				closeDrawingContainerAndClearCanvas();
			} else {
				updateTimerDisplay(count);
				count++;
			}
		}
	}

	function handleStartBtn() {
		isOverlayOpen = false;
		handleOverlayAction();
		setTimeout(() => {
			startDrawing = true;
			startTimer();
		}, 100);
		p.background(180);
	}

	function handleGameOverEvent() {
		document.querySelector(".game-over-page").style.display = "block";
	}

	p.preload = function () {
		classifier = ml5.imageClassifier("DoodleNet");
	};

	console.log(questions.length);

	p.setup = function () {
		canvas = p.createCanvas(
			parentContainer.elt.offsetWidth,
			parentContainer.elt.offsetHeight
		);
		p.background(180);

		EraseBtn.mousePressed(clearCanvas);
		closeDrawing.mousePressed(closeDrawingContainerAndClearCanvas);

		canvas.mouseReleased(classifyCanvas);
		footer.html("...");
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

		footer.html(
			`I see: ${results[0].label}, ${results[1].label}, ${results[2].label}`
		);

		results.slice(0, 3).forEach(res => {
			console.log(res);
			speectBot.speak(res.label);
		});
	}

	function clearCanvas() {
		p.background(180);
		footer.html("...");
	}

	function closeDrawingContainerAndClearCanvas() {
		isOverlayOpen = true;
		startDrawing = false;
		count = 0;
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
