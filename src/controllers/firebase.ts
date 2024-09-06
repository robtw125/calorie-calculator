import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyA5ADfXPRWg9t-w7nEsoQq4HmvQ2nCFBL8',
  authDomain: 'calorie-calculator-8d981.firebaseapp.com',
  projectId: 'calorie-calculator-8d981',
  storageBucket: 'calorie-calculator-8d981.appspot.com',
  messagingSenderId: '590343679898',
  appId: '1:590343679898:web:37193fd79c54cabc9e5423',
  measurementId: 'G-799JR6F9WE'
}

const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const db = getFirestore(app)
