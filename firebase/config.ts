import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDFxl7PAmnaUckuBIpvMIuY24q_NtW8MJA",
  authDomain: "pulsegps.firebaseapp.com",
  databaseURL: "https://pulsegps-default-rtdb.firebaseio.com",
  projectId: "pulsegps",
  storageBucket: "pulsegps.appspot.com",
  messagingSenderId: "190543823804",
  appId: "1:190543823804:web:6b369d5af6ca25d6a761b9",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
