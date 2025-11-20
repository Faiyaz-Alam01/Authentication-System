// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:"AIzaSyCuljE10KNJ4F2567ggHjJ2-8r5Qh-KVVw",
  authDomain: "authentication-system-e3547.firebaseapp.com",
  projectId: "authentication-system-e3547",
	storageBucket: "authentication-system-e3547.appspot.com",
  messagingSenderId: "85890493782",
  appId: "1:85890493782:web:da63e4a63a3791851f7af7",
  measurementId: "G-RHG9NTDGCJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()
// Force Google to show "Choose an account"
provider.setCustomParameters({
  prompt:"select_account"
})

export {auth, provider}