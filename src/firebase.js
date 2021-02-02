import firebase from "firebase/app"
import "firebase/auth"

const app = firebase.initializeApp({
    apiKey: "AIzaSyC6wbZ_bS2r23bGA7lff4raAwX1EHRfRQA",
    authDomain: "rowing-a06ba.firebaseapp.com",
    projectId: "rowing-a06ba",
    storageBucket: "rowing-a06ba.appspot.com",
    messagingSenderId: "839779071685",
    appId: "1:839779071685:web:cc3abd3397c36b9ef622ac",
    measurementId: "G-ZDS8BNRX3P"
  });

  export const auth = app.auth()
  export default app