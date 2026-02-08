// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMGVPStc1Zh6uwqvYt_cVOWCH6LHIocyY",
  authDomain: "blogapp-84aef.firebaseapp.com",
  projectId: "blogapp-84aef",
  storageBucket: "blogapp-84aef.firebasestorage.app",
  messagingSenderId: "411849777258",
  appId: "1:411849777258:web:b3e74987180e6205702a13",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export async function googleAuth() {
  try {
    let data = await signInWithPopup(auth, provider);
    return data;
  } catch (error) {
    console.log(error);
  }
}
