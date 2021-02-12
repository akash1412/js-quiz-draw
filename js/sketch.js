import { isOverlayOpen } from "./index";

let sketch = function (p) {
	// 	let parentContainer = p.select("#drawing-container");
	// 	let clearBtn = p.select("#clear-btn");
	// 	let footer = p.select("#footer");
	// 	let classifier;
	// 	let canvas;
	// 	p.preload = function () {
	// 		classifier = ml5.imageClassifier("DoodleNet");
	// 	};
	// 	p.setup = function () {
	// 		canvas = p.createCanvas(
	// 			parentContainer.elt.offsetWidth,
	// 			parentContainer.elt.offsetHeight
	// 		);
	// 		p.background(180);
	// 		clearBtn.mousePressed(clearCanvas);
	// 		canvas.mouseReleased(classifyCanvas);
	// 		footer.html("listening");
	// 	};
	// 	p.draw = function () {
	// 		p.strokeWeight(15);
	// 		p.stroke(0);
	// 		if (p.mouseIsPressed && !isOverlayOpen) {
	// 			console.log('its is clicked')
	// 			p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
	// 		}
	// 	};
	// 	function classifyCanvas() {
	// 		classifier.classify(canvas, gotResult);
	// 	}
	// 	function gotResult(error, results) {
	// 		if (error) {
	// 			console.error(error);
	// 		}
	// 		footer.html(`Label: ${results[0].label}`);
	// 	}
	// 	function clearCanvas() {
	// 		p.background(180);
	// 		footer.html("listening");
	// 	}
	// };
	// new p5(sketch, "drawing-container");
	//
	// p.windowResized = function () {
	// 	p.resizeCanvas(
	// 		parentContainer.elt.offsetWidth,
	// 		parentContainer.elt.offsetHeight
	// 	);
	// };
};
