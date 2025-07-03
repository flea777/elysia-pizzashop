import Elysia from 'elysia'
import { auth } from '../plugins/auth'

export const signOut = new Elysia()
  .use(auth)
  .post('/sign-out', async ({ signOutUser }) => {
    signOutUser()
  })
