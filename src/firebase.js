import firebase from "firebase/app"
import "firebase/auth"
import 'firebase/storage'

/*
const app = firebase.initializeApp({
    apiKey: "AIzaSyC6wbZ_bS2r23bGA7lff4raAwX1EHRfRQA",
    authDomain: "rowing-a06ba.firebaseapp.com",
    projectId: "rowing-a06ba",
    storageBucket: "rowing-a06ba.appspot.com",
    messagingSenderId: "839779071685",
    appId: "1:839779071685:web:cc3abd3397c36b9ef622ac",
    measurementId: "G-ZDS8BNRX3P"
  });
  */

  const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
  })

  export const auth = app.auth()
  export const storage = app.storage()
  export default app