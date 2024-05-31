import express from 'express'
import orderCtrl from '../controllers/order.controller'
import productCtrl from '../controllers/product.controller'
import authCtrl from '../controllers/auth.controller'
import shopCtrl from '../controllers/shop.controller'
import userCtrl from '../controllers/user.controller'

const router = express.Router()

router.route('/api/orders/:userId')
  .post(authCtrl.requireSignin, userCtrl.stripeCustomer, productCtrl.decreaseQuantity, orderCtrl.create)

  //to get orders for a specific shop so that authenticated seller can view orders for each of theirs shops in one place
router.route('/api/orders/shop/:shopId')
  .get(authCtrl.requireSignin, shopCtrl.isOwner, orderCtrl.listByShop)

router.route('/api/orders/user/:userId')
  .get(authCtrl.requireSignin, orderCtrl.listByUser)

  //retrieve enum values
router.route('/api/order/status_values')
  .get(orderCtrl.getStatusValues)

  //if seller cancels order
  //.put request so that the products stock qty can be increased and the order can be updated in db
router.route('/api/order/:shopId/cancel/:productId')
  .put(authCtrl.requireSignin, shopCtrl.isOwner, productCtrl.increaseQuantity, orderCtrl.update)


//when a seller processes an order,
//.put request to update and create a charge on the customers cc for the price of the product times the qty ordered
router.route('/api/order/:orderId/charge/:userId/:shopId')
  .put(authCtrl.requireSignin, shopCtrl.isOwner, userCtrl.createCharge, orderCtrl.update)


//.put request to directly update the order in db
router.route('/api/order/status/:shopId')
  .put(authCtrl.requireSignin, shopCtrl.isOwner, orderCtrl.update)

router.route('/api/order/:orderId')
  .get(orderCtrl.read)

//to retrieve user associated with :userId param in route,
//get user from User collection and attaches it to the request obj so it can be accessed by next methods
router.param('userId', userCtrl.userByID)

//to retrieve the shops associated with the :shopId parm in the route we use shopByID shop controller method
router.param('shopId', shopCtrl.shopByID)
//to retrieve the product associated with the productId param in the route, we use productById,
//so we can retrieve it and attach it to the request obj for next methods...
router.param('productId', productCtrl.productByID)

//retrieve order associated with orderId parm in the route, used orderById method,
//this helps us attach it to the req obj for next method...
router.param('orderId', orderCtrl.orderByID)

export default router