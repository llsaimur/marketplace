import {Order, CartItem} from '../models/order.model'
import errorHandler from './../helpers/dbErrorHandler'

//takes the order details, creates a new order, and saves it to the Order collection in db
//with this method orders can be created and stored in the backend by any signed-in user
const create = async (req, res) => {
  try {
    req.body.order.user = req.profile
    const order = new Order(req.body.order)
    let result = await order.save()
    res.status(200).json(result)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

//retrieve the orders that have prodcuts purchased with matchin shop ID, then populate ID name and price fields for each product with orders sorted by date from most recent to oldest
const listByShop = async (req, res) => {
  try {
    let orders = await Order.find({"products.shop": req.shop._id})
      .populate({path: 'products.product', select: '_id name price'})
      .sort('-created')
      .exec()
    res.json(orders)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

//query the Order collection and find the order with the CartItem obj that matchted the updated product
//set status value of this matched CartItem in the product array of the order
const update = async (req, res) => {
  try {
    let order = await Order.update({'products._id':req.body.cartItemId}, {'$set': {
        'products.$.status': req.body.status
    }})
      res.json(order)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

//return enum values for the status field from the CartItem schema
const getStatusValues = (req, res) => {
  res.json(CartItem.schema.path('status').enumValues)
}

const orderByID = async (req, res, next, id) => {
  try {
    let order = await Order.findById(id).populate('products.product', 'name price').populate('products.shop', 'name').exec()
    if (!order)
      return res.status('400').json({
        error: "Order not found"
      })
    req.order = order
    next()
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listByUser = async (req, res) => {
  try{
    let orders = await Order.find({ "user": req.profile._id })
        .sort('-created')
        .exec()
    res.json(orders)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const read = (req, res) => {
  return res.json(req.order)
}

export default {
  create,
  listByShop,
  update,
  getStatusValues,
  orderByID,
  listByUser,
  read
}