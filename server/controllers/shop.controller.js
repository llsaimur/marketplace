import Shop from '../models/shop.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'
import defaultImage from './../../client/assets/images/default.png'

//multipart form, using formidable for images, it will store img temporarily in file system and using fs module to retrive filetype and data to store in img field in our shop model
const create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.status(400).json({
                message: "Image could not be uploaded"
            })
        }
        let shop = new Shop(fields)
        shop.owner = req.profile
        if (files.image) {
            shop.image.data = fs.readFileSync(files.image.path)
            shop.image.contentType = files.image.type
        }
        try {
            let result = await shop.save()
            res.status(200).json(result)
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
    })
}

// :shopid parm in route URL will invoke shopById controller mthod, it retrieves the shop from db and attaches it to the request obj to be used in the next method,
// shop obj queried from db will contain name and id details of owner using populate() method
const shopByID = async (req, res, next, id) => {
    try {
        let shop = await Shop.findById(id).populate('owner', '_id name').exec()
        if (!shop)
            return res.status('400').json({
                error: "Shop not found"
            })
        req.shop = shop
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve shop"
        })
    }
}

// retrive img from db
const photo = (req, res, next) => {
    if (req.shop.image.data) {
        res.set("Content-Type", req.shop.image.contentType)
        return res.send(req.shop.image.data)
    }
    next()
}

// return default img
const defaultPhoto = (req, res) => {
    return res.sendFile(process.cwd() + defaultImage)
}

// return this shop obj in response to the client
// we remove img field before sending response since img will be retrieved as files in seperate routes
const read = (req, res) => {
    req.shop.image = undefined
    return res.json(req.shop)
}


//use formidable and fs modules like create method, to parse form data and update existing shop in db
const update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.status(400).json({
                message: "Photo could not be uploaded"
            })
        }
        let shop = req.shop
        shop = extend(shop, fields)
        shop.updated = Date.now()
        if (files.image) {
            shop.image.data = fs.readFileSync(files.image.path)
            shop.image.contentType = files.image.type
        }
        try {
            let result = await shop.save()
            res.json(result)
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
    })
}

//deletes doc that is associated with id from the Shops collection in db
const remove = async (req, res) => {
    try {
        let shop = req.shop
        let deletedShop = shop.remove()
        res.json(deletedShop)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

//query the shops collection in db and to return all shops,
const list = async (req, res) => {
    try {
        let shops = await Shop.find()
        res.json(shops)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

//query Shop colletion in db and get the matching shops
// we find all the shops where owner field matches userId parm, then populate the referenced user's ID and name in the owner field
// returning the shops in an array in response to the client
const listByOwner = async (req, res) => {
    try {
        let shops = await Shop.find({ owner: req.profile._id }).populate('owner', '_id name')
        res.json(shops)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const isOwner = (req, res, next) => {
    const isOwner = req.shop && req.auth && req.shop.owner._id == req.auth._id
    if (!isOwner) {
        return res.status('403').json({
            error: "User is not authorized"
        })
    }
    next()
}

export default {
    create,
    shopByID,
    photo,
    defaultPhoto,
    list,
    listByOwner,
    read,
    update,
    isOwner,
    remove
}


