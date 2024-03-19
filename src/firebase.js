import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBB6SykzEVscJ5F69ewYgTLylc_ntM-xuA",
    authDomain: "snapmsg-84290.firebaseapp.com",
    databaseURL: "https://snapmsg-84290-default-rtdb.firebaseio.com",
    projectId: "snapmsg-84290",
    storageBucket: "snapmsg-84290.appspot.com",
    messagingSenderId: "796408856764",
    appId: "1:796408856764:web:61d3e82d56cc44f27050b9",
    measurementId: "G-LB0BJ5W9Y3"
  };
   
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  
  // Initialize Firebase Authentication and get a reference to the service
  export const auth = getAuth(app);
  export default app;