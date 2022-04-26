import firebase from "firebase/compat/app"
import "firebase/compat/storage"
import "firebase/compat/firestore"
export const app = firebase.initializeApp({
    "projectId": "proyecto-alquilar",
    "appId": "1:1016802053702:web:2c8d56f1b74b08be7c8447",
    "storageBucket": "proyecto-alquilar.appspot.com",
    "locationId": "us-central",
    "apiKey": "AIzaSyCbXkMiy6rITT8ra5bAit8wiriF51dqc3E",
    "authDomain": "proyecto-alquilar.firebaseapp.com",
    "messagingSenderId": "1016802053702"
  });