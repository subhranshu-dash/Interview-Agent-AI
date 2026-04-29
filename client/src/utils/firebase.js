
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interview-agent-fbbd7.firebaseapp.com",
  projectId: "interview-agent-fbbd7",
  storageBucket: "interview-agent-fbbd7.firebasestorage.app",
  messagingSenderId: "190258509632",
  appId: "1:190258509632:web:af81f5d3652f84fb48aca5"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth,provider}