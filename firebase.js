import { initializeApp } from "firebase/app";
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from "firebase/auth"; 
import { getStorage } from "firebase/storage";
import { initializeFirestore  } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyD_rV6Y3BGWfHRLTb_BMsxxTwmXpNqoc30",
  authDomain: "meetapp-b1276.firebaseapp.com",
  projectId: "meetapp-b1276",
  storageBucket: "meetapp-b1276.appspot.com",
  messagingSenderId: "59078083007",
  appId: "1:59078083007:web:9b3feaa643e918e247210a"
};

export const app = initializeApp(firebaseConfig);
export const auth =getAuth(app);
export const storege = getStorage(app);
export const db = initializeFirestore(app,{ 
    experimentalForceLongPolling:true,
});
 
export function signIn(email, password){
    return signInWithEmailAndPassword(auth,email,password);
}
export function signUp(email, password){
    return createUserWithEmailAndPassword(auth,email,password);
}
