import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
	apiKey: "AIzaSyCdkWyDxO9F1IMINLCGfAXtFQz7CtE3120",
	authDomain: "deverse-complaint.firebaseapp.com",
	projectId: "deverse-complaint",
	storageBucket: "deverse-complaint.appspot.com",
	messagingSenderId: "521729293380",
	appId: "1:521729293380:web:7efc16533d80ed10991011",
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

export { firebase };
