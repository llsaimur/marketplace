import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'
import auth from './../auth/auth-helper'
import {getStatusValues, update, cancelProduct, processCharge} from './api-order.js'

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4),
    paddingBottom: 0
  },
  listImg: {
    width: '70px',
    verticalAlign: 'top',
    marginRight: '10px'
  },
  listDetails: {
    display: "inline-block"
  },
  listQty: {
    margin: 0,
    fontSize: '0.9em',
    color: '#5f7c8b'
  },
  textField: {
    width: '160px',
    marginRight: '16px'
  },
  statusMessage: {
    position: 'absolute',
    zIndex: '12',
    right: '5px',
    padding: '5px'
  }
}))
export default function ProductOrderEdit (props){
  const classes = useStyles()
  const [values, setValues] = useState({
      open: 0,
      statusValues: [],
      error: ''
  })
  const jwt = auth.isAuthenticated()

  //to be able to list the valid status values in the dropdwon option for updating an ordered products status,
  //we retrieve list of possible status values from the server in a useEffect hook
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    getStatusValues(signal).then((data) => {
      if (data.error) {
        setValues({...values, error: "Could not get status"})
      } else {
        setValues({...values, statusValues: data, error: ''})
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])

  //status values that are retrieved from server are set to state and rendered in dropdwon as MenuItem
  //when option is selected this method is invoked...

  //this updates the orders in the state as well as sends request to the appropriate backedn API based on value
  //
  const handleStatusChange = productIndex => event => {
    let order = props.order
    order.products[productIndex].status = event.target.value
    let product = order.products[productIndex]

    if (event.target.value == "Cancelled") {
        //take corresponding shop Id, product ID, cartItem Id, selected status value, ordered qty and user credential 
        //sends with request to the cancel prodcut api in backend, then updates it
      cancelProduct({
          shopId: props.shopId,
          productId: product.product._id
        }, {
          t: jwt.token
        }, {
          cartItemId: product._id,
          status: event.target.value,
          quantity: product.quantity
        })
        .then((data) => {
          if (data.error) {
            setValues({
              ...values,
              error: "Status not updated, try again"
            })
          } else {
            props.updateOrders(props.orderIndex, order)
            setValues({
              ...values,
              error: ''
            })
          }
        })
    } else if (event.target.value == "Processing") {
        //tkae the corresponding order Id, shop Id, customer User Id, cartItem id, selected status value, total cost and user credentials,
        //to send a request ot the process charge api in backend, then update...
      processCharge({
          userId: jwt.user._id,
          shopId: props.shopId,
          orderId: order._id
        }, {
          t: jwt.token
        }, {
          cartItemId: product._id,
          status: event.target.value,
          amount: (product.quantity * product.product.price)
        })
        .then((data) => {
          if (data.error) {
            setValues({
              ...values,
              error: "Status not updated, try again"
            })
          } else {
            props.updateOrders(props.orderIndex, order)
            setValues({
              ...values,
              error: ''
            })
          }
        })
    } else {
        //if seller chooses to update status of an ordered product so it has avalue other than cancelled or processing
        //take corresponding shopID, cartItem ID, selected status value, and user credentials to send
        //with the request to the update order api, then update the orders in the view
      update({
          shopId: props.shopId
        }, {
          t: jwt.token
        }, {
          cartItemId: product._id,
          status: event.target.value
        })
        .then((data) => {
          if (data.error) {
            setValues({
              ...values,
              error: "Status not updated, try again"
            })
          } else {
            props.updateOrders(props.orderIndex, order)
            setValues({
              ...values,
              error: ''
            })
          }
        })
    }
  }
   //take an order obj as a prop and iterate through the order's products arrat to display only the products that have been purchased from the current shop
    return (
    <div>
      
      <Typography component="span" color="error" className={classes.statusMessage}>
        {values.error}
      </Typography>
      <List disablePadding style={{backgroundColor:'#f8f8f8'}}>
       
        {props.order.products.map((item, index) => {
          return <span key={index}>
                  { item.shop == props.shopId &&
                    <ListItem button className={classes.nested}>
                      <ListItemText
                        primary={<div>
                                    <img className={classes.listImg} src={'/api/product/image/'+item.product._id}/>
                                    <div className={classes.listDetails}>
                                      {item.product.name}
                                      <p className={classes.listQty}>{"Quantity: "+item.quantity}</p>
                                    </div>
                                  </div>}/>
                      <TextField
                        id="select-status"
                        select
                        label="Update Status"
                        className={classes.textField}
                        value={item.status}
                        onChange={handleStatusChange(index)}
                        SelectProps={{
                          MenuProps: {
                            className: classes.menu,
                          },
                        }}
                        margin="normal"
                      >
                        {values.statusValues.map(option => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </ListItem>
                  }
                  <Divider style={{margin: 'auto', width: "80%"}}/>
                </span>})
              }
      </List>
    </div>)
}
ProductOrderEdit.propTypes = {
  shopId: PropTypes.string.isRequired,
  order: PropTypes.object.isRequired,
  orderIndex: PropTypes.number.isRequired,
  updateOrders: PropTypes.func.isRequired
}