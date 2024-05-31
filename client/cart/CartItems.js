import React, { useState } from 'react'
import auth from './../auth/auth-helper'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import cart from './cart-helper.js'
import { Link } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    card: {
        margin: '24px 0px',
        padding: '16px 40px 60px 40px',
        backgroundColor: '#80808017'
    },
    title: {
        margin: theme.spacing(2),
        color: theme.palette.openTitle,
        fontSize: '1.2em'
    },
    price: {
        color: theme.palette.text.secondary,
        display: 'inline'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginTop: 0,
        width: 50
    },
    productTitle: {
        fontSize: '1.15em',
        marginBottom: '5px'
    },
    subheading: {
        color: 'rgba(88, 114, 128, 0.67)',
        padding: '8px 10px 0',
        cursor: 'pointer',
        display: 'inline-block'
    },
    cart: {
        width: '100%',
        display: 'inline-flex'
    },
    details: {
        display: 'inline-block',
        width: "100%",
        padding: "4px"
    },
    content: {
        flex: '1 0 auto',
        padding: '16px 8px 0px'
    },
    cover: {
        width: 160,
        height: 125,
        margin: '8px'
    },
    itemTotal: {
        float: 'right',
        marginRight: '40px',
        fontSize: '1.5em',
        color: 'rgb(72, 175, 148)'
    },
    checkout: {
        float: 'right',
        margin: '24px'
    },
    total: {
        fontSize: '1.2em',
        color: 'rgb(53, 97, 85)',
        marginRight: '16px',
        fontWeight: '600',
        verticalAlign: 'bottom'
    },
    continueBtn: {
        marginLeft: '10px'
    },
    itemShop: {
        display: 'block',
        fontSize: '0.90em',
        color: '#78948f'
    },
    removeButton: {
        fontSize: '0.8em'
    }
}))

export default function CartItems(props) {
    const classes = useStyles()
    //retrieve the cart items using the getCart helper method and set it to the state of initial value of cartItems...
    const [cartItems, setCartItems] = useState(cart.getCart())

    const handleChange = index => event => {
        let updatedCartItems = cartItems
        if (event.target.value == 0) {
            updatedCartItems[index].quantity = 1
        } else {
            updatedCartItems[index].quantity = event.target.value
        }
        setCartItems([...updatedCartItems])
        cart.updateCart(index, event.target.value)
    }

    //calculate total price while taking unit price and qty each item in the cartItems array into consideration
    const getTotal = () => {
        return cartItems.reduce((a, b) => {
            return a + (b.quantity * b.product.price)
        }, 0)
    }

    //use removeItem helper method to remvoe item from cart in localstorage, then updated the cartItems in the state,
    //method also checks whether cart has been emptied so thath cehckout can be hidden by using the setCheckout function passed as a prop from Cart component
    const removeItem = index => event => {
        let updatedCartItems = cart.removeItem(index)
        if (updatedCartItems.length == 0) {
            props.setCheckout(false)
        }
        setCartItems(updatedCartItems)
    }

    //use setCheckout method passed as a prop to set the checkout value to true in Cart componennt
    //once checkout value is true in cart view, checkout componnent will be rendered to allow use to enter checkout details and place an order...
    const openCheckout = () => {
        props.setCheckout(true)
    }

    //iterates over the items and render the products in cart, if no items a message is displayed
    //show details of product, editable qty, remove option, and total price as well as start checkout process
    //to modify qty
    //when user updated this value, the handleChange method is called to enforce 
    //remove item

    return (<Card className={classes.card}>
        <Typography type="title" className={classes.title}>
            Shopping Cart
        </Typography>

        {cartItems.length > 0 ? (<span>
            {cartItems.map((item, i) => {
                return <span key={i}><Card className={classes.cart}>
                    <CardMedia
                        className={classes.cover}
                        image={'/api/product/image/' + item.product._id}
                        title={item.product.name}
                    />
                    <div className={classes.details}>
                        <CardContent className={classes.content}>
                            <Link to={'/product/' + item.product._id}><Typography type="title" component="h3" className={classes.productTitle} color="primary">{item.product.name}</Typography></Link>
                            <div>
                                <Typography type="subheading" component="h3" className={classes.price} color="primary">$ {item.product.price}</Typography>
                                <span className={classes.itemTotal}>${item.product.price * item.quantity}</span>
                                <span className={classes.itemShop}>Shop: {item.product.shop.name}</span>
                            </div>
                        </CardContent>
                        <div className={classes.subheading}>

                            Quantity: <TextField
                                value={item.quantity}
                                onChange={handleChange(i)}
                                type="number"
                                inputProps={{
                                    min: 1
                                }}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="normal" />

                            <Button className={classes.removeButton} color="primary" onClick={removeItem(i)}>x Remove</Button>
                        </div>
                    </div>
                </Card>
                    <Divider />
                </span>
            })
            }

            <div className={classes.checkout}>
                <span className={classes.total}>Total: ${getTotal()}</span>
                {!props.checkout && (auth.isAuthenticated() ?
                    //when the checkout button is clikced we use openCheckout method
                    <Button color="secondary" variant="contained" onClick={openCheckout}>Checkout</Button>
                    :
                    <Link to="/signin">
                        <Button color="primary" variant="contained">Sign in to checkout</Button>
                    </Link>)}
                <Link to='/' className={classes.continueBtn}>
                    <Button variant="contained">Continue Shopping</Button>
                </Link>
            </div>
        </span>) :
            <Typography variant="subtitle1" component="h3" color="primary">No items added to your cart.</Typography>
        }
    </Card>)
}

CartItems.propTypes = {
    checkout: PropTypes.bool.isRequired,
    setCheckout: PropTypes.func.isRequired
}