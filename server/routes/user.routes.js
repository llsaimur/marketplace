import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/users')
  .get(userCtrl.list)
  .post(userCtrl.create)

router.route('/api/users/:userId')
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove)

 //to complete OAuth process, we need to mkae a post api call to stipe OAuth froum our server
 // we need to send retrieved auth code to Stripe OAuth with the POST API call and receive the credentials to be stored in the seller's user account for processing charges.
router.route('/api/stripe_auth/:userId')
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.stripe_auth, userCtrl.update)

router.param('userId', userCtrl.userByID)

export default router