import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyDRH5L-yWDIZIFtjDI_rr0YI0WqrkkF3Uw',
  authDomain: 'recruitingapp-8355f.firebaseapp.com',
  projectId: 'recruitingapp-8355f',
  storageBucket: 'recruitingapp-8355f.appspot.com',
  messagingSenderId: '1024138795546',
  appId: '1:1024138795546:web:7da832a0968afe84d84fa3'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export default app
