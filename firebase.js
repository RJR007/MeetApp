import { initializeApp } from "firebase/app";
import {
    createUserWithEmailAndPassword, 
    getAuth, 
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    } 
    from "firebase/auth"; 
import { getStorage } from "firebase/storage";
import { initializeFirestore  } from "firebase/firestore";
import SimpleToast from "react-native-simple-toast";

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
        return signInWithEmailAndPassword(auth,email,password).catch(function(error){
            //alert(error.code,error.message);
            SimpleToast.showWithGravity(error.code.substr(5), SimpleToast.LONG, SimpleToast.CENTER);
        });   
}
export function signUp(email, password){
    return createUserWithEmailAndPassword(auth,email,password).catch(function(error){
        //alert(error.code,error.message);
        SimpleToast.showWithGravity(error.code.substr(5), SimpleToast.LONG, SimpleToast.CENTER);
        if(error.code.substr(5) === "email-already-in-use"){
            alert("Please Click on 'Already have an account?' then press forgot Password!")
        }
    });
}
export function forgotPassword(email){
    sendPasswordResetEmail(auth, email, null)
        .then(() => {
            alert("For reset Password,we are sent link to your Email ID:" + email + "\n" + "Check Your Email Inbox");
        })
        .catch(function (e) {
        SimpleToast.showWithGravity(e.code.substr(5), SimpleToast.LONG, SimpleToast.CENTER);
        });
};
