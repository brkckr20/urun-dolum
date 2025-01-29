import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    // Firebase yapılandırma bilgilerinizi buraya ekleyin
    apiKey: "AIzaSyAoJWFk--xZmCVoJQtH281QqEdg9VNKLDw",
    authDomain: "portfolio-280f9.firebaseapp.com",
    projectId: "portfolio-280f9",
    storageBucket: "portfolio-280f9.appspot.com",
    messagingSenderId: "891969655916",
    appId: "1:891969655916:web:9b0146077ac2b08cf43449"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth } 