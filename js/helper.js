import fireStoreDB from '../lib/firebase.config.js';

export const TakeSnapshot = async (
	drawringContainerRef,
	imageLabel,
	IS_CANVAS_CLEAN
) => {
	const canvasScreenshot = await html2canvas(drawringContainerRef);

	const image = new Image();

	image.src = canvasScreenshot.toDataURL('image/png');

	const sektch = {
		url: image.src,
		title: imageLabel,
	};

	if (!IS_CANVAS_CLEAN) {
		await fireStoreDB.collection('screenshots').add(sektch);
	}

	const newImageCard = document.createElement('div');

	const cardTitle = document.createElement('h1');

	const imagePlaceholder = document.createElement('div');

	image.classList.add('captured-image');

	cardTitle.classList.add('card-title');

	imagePlaceholder.classList.add('image-placeholder');

	cardTitle.textContent = imageLabel;

	newImageCard.classList.add('card-image-container');

	imagePlaceholder.appendChild(image);

	newImageCard.appendChild(imagePlaceholder);
	newImageCard.appendChild(cardTitle);

	return newImageCard;
};
