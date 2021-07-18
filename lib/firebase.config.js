const firebaseConfig = {
	apiKey: 'AIzaSyBWpeTa4WtjKMdtmxCRXZfHZ6YObSgWDE8',
	authDomain: 'quiz-draw.firebaseapp.com',
	projectId: 'quiz-draw',
	storageBucket: 'quiz-draw.appspot.com',
	messagingSenderId: '120395776770',
	appId: '1:120395776770:web:8e6283b74415c5e18d381b',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const fireStoreDB = firebase.firestore();

export default fireStoreDB;
