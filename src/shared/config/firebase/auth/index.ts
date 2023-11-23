import { type User } from 'firebase/auth/cordova'
import app from '../config'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'

const auth = getAuth(app)

export const loginWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider()
  const { user } = await signInWithPopup(auth, provider)

  return user
}
