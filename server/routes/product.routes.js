import express from 'express'
import productCtrl from '../controllers/product.controller'
import authCtrl from '../controllers/auth.controller'
import shopCtrl from '../controllers/shop.controller'

const router = express.Router()

//.post route, a request to this route will create new product linked to the shop w the help of :shopId param
    //.get route to retrieve products from a specific shop in db
router.route('/api/products/by/:shopId')
  .post(authCtrl.requireSignin, shopCtrl.isOwner, productCtrl.create)
  .get(productCtrl.listByShop)

  //.get request to fetch the latest products
router.route('/api/products/latest')
  .get(productCtrl.listLatest)


//.get request to show five related products as suggestions...
    //:productId param in route URL route will call the productByID controller method,
        // to retrieve the product fomr db and attaches it to the request object to be used in the next method
router.route('/api/products/related/:productId')
  .get(productCtrl.listRelated)


  ///.get route to retrieve all disting categories in Producst collection in db
router.route('/api/products/categories')
  .get(productCtrl.listCategories)

  //GET request at /api/products?search=value&category=value
router.route('/api/products')
  .get(productCtrl.list)

//.get route to query the Product collection with an Id and returns the product in response
    //to get a single product
        //:product param in the URL invokes the productById controller method to retrieve the product fomr db and append it to the request obj
router.route('/api/products/:productId')
  .get(productCtrl.read)



router.route('/api/product/image/:productId')
  .get(productCtrl.photo, productCtrl.defaultPhoto)
router.route('/api/product/defaultphoto')
  .get(productCtrl.defaultPhoto)


  
router.route('/api/product/:shopId/:productId')
  .put(authCtrl.requireSignin, shopCtrl.isOwner, productCtrl.update)
  .delete(authCtrl.requireSignin, shopCtrl.isOwner, productCtrl.remove)

router.param('shopId', shopCtrl.shopByID)
router.param('productId', productCtrl.productByID)

export default router