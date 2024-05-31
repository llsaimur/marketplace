import React, {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import AddCartIcon from '@material-ui/icons/AddShoppingCart'
import DisabledCartIcon from '@material-ui/icons/RemoveShoppingCart'
import cart from './cart-helper.js'
import { Redirect } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  iconButton: {
    width: '28px',
    height: '28px'
  },
  disabledIconButton: {
    color: '#7f7563',
    width: '28px',
    height: '28px'
  }
}))

export default function AddToCart(props) {
  const classes = useStyles()
  const [redirect, setRedirect] = useState(false)


//invokes addItem wich takes the product item and a state-updating callback function as params and stores the updated cart details in localstorage and executes calllback that was passed
    //check method in cart-helper.js
  const addToCart = () => {
    cart.addItem(props.item, () => {
      setRedirect({redirect:true})
    })
  }
    if (redirect) {
      return (<Redirect to={'/cart'}/>)
    }
     //if depending on the qty of the product the add to cart icon will render diff,
            //if it has more than 0 it will show available otherwise na
    return (<span>
       
      {props.item.quantity >= 0 ?
        <IconButton color="secondary" dense="dense" onClick={addToCart}>
          <AddCartIcon className={props.cartStyle || classes.iconButton}/>
        </IconButton> :
        <IconButton disabled={true} color="secondary" dense="dense">
          <DisabledCartIcon className={props.cartStyle || classes.disabledIconButton}/>
        </IconButton>}
      </span>)
}

AddToCart.propTypes = {
  item: PropTypes.object.isRequired,
  cartStyle: PropTypes.string
}