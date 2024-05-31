import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import shopCtrl from '../controllers/shop.controller'

const router = express.Router()

//route to retrive all the shops stored in db
router.route('/api/shops')
  .get(shopCtrl.list)

  //queries Shop collection with an ID and returns the shop in response
router.route('/api/shop/:shopId')
  .get(shopCtrl.read)

//.post route for creating a shop, check if user is signed in and has authorization as well if is a seller
//.get route to retrive all shops created by given user 
router.route('/api/shops/by/:userId')
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.isSeller, shopCtrl.create)
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, shopCtrl.listByOwner)

  //.put route to update existing shop in db
    // route first makes sure isOwner method confirms signed in user is the owner of the shop then proceeds with method
router.route('/api/shops/:shopId')
  .put(authCtrl.requireSignin, shopCtrl.isOwner, shopCtrl.update)
  .delete(authCtrl.requireSignin, shopCtrl.isOwner, shopCtrl.remove)

  //gets img data from mongo and sends a file in response
router.route('/api/shops/logo/:shopId')
  .get(shopCtrl.photo, shopCtrl.defaultPhoto)

router.route('/api/shops/defaultphoto')
  .get(shopCtrl.defaultPhoto)

//:shopid parm in route URL will invoke shopById controller mthod, it retrieves the shop from db and attaches it to the request obj to be used in the next method
router.param('shopId', shopCtrl.shopByID)
//using User's controller method userById to find a specific user, this will help us for our routes to process :userId param
router.param('userId', userCtrl.userByID)

export default router