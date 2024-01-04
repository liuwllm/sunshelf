import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebaseui/dist/firebaseui.css'
import { useCallback, useEffect } from 'react';

require('dotenv').config({path:__dirname+'/./../.env'})

const firebaseConfig = {
  apiKey: `${process.env.API_KEY}`,
  authDomain: `${process.env.AUTH_DOMAIN}`,
  projectId: `${process.env.PROJECT_ID}`,
  storageBucket: `${process.env.STORAGE_BUCKET}`,
  messagingSenderId: `${process.env.MESSAGING_SENDER_ID}`,
  appId: `${process.env.APP_ID}`,
  measurementId: `${process.env.MEASUREMENT_ID}`,
};

const app = firebase.initializeApp(firebaseConfig);

export default function Login(){
    const loadFirebaseui = useCallback(async() => {
        const firebaseui = await import("firebaseui");
        const firebaseUi = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
        firebaseUi.start('#firebaseui-auth-container', {
            signInOptions: [
                firebase.auth.EmailAuthProvider.PROVIDER_ID
            ],
        });
    }, [firebase, firebaseConfig]);
    
    useEffect(() => {
        loadFirebaseui();
    }, []);
    
    
    return (
        <>
            <div id="firebaseui-auth-container"></div>
        </>
    )
}

