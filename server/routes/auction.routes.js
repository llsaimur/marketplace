import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import auctionCtrl from '../controllers/auction.controller'

const router = express.Router()


//.get request and queries Auction collection to return the open auctions that are found in response
router.route('/api/auctions')
  .get(auctionCtrl.listOpen)


  //.get request all auctions thta a given user placed bids in
  //queries auction collection so that it returns relevant auction in response
router.route('/api/auctions/bid/:userId')
  .get(auctionCtrl.listByBidder)

  //.get request to return a single auction
router.route('/api/auction/:auctionId')
  .get(auctionCtrl.read)

  //.post request to create a new auction in db
  //.get request to retrieve these auctions from db, queries auction collection so it returns auctions by a specific seller
router.route('/api/auctions/by/:userId')
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.isSeller, auctionCtrl.create)
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, auctionCtrl.listBySeller)

//update/delete request, we use auctionId parm in route URL to invoke method auctionById to retrieve auction from db and attach it to the request
router.route('/api/auctions/:auctionId')
  .put(authCtrl.requireSignin, auctionCtrl.isSeller, auctionCtrl.update)
  .delete(authCtrl.requireSignin, auctionCtrl.isSeller, auctionCtrl.remove)

router.route('/api/auctions/image/:auctionId')
  .get(auctionCtrl.photo, auctionCtrl.defaultPhoto)

router.route('/api/auctions/defaultphoto')
  .get(auctionCtrl.defaultPhoto)

router.param('auctionId', auctionCtrl.auctionByID)
router.param('userId', userCtrl.userByID)

export default router