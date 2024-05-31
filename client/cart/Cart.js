import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import CartItems from './CartItems'
import { StripeProvider } from 'react-stripe-elements'
import config from './../../config/config'
import Checkout from './Checkout'

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        margin: 30,
    }
}))

export default function Cart() {
    const classes = useStyles()
    const [checkout, setCheckout] = useState(false)

    const showCheckout = val => {
        setCheckout(val)
    }
    
    //component is passed a checkout boolean value and a state update method for this checkout value
    // so Checkout component and its options are rendered conditonnlay based on user interactions


    //Checkout component needs it to render Card Elements and process card detail input
    //Wrap the checkout component with the StripeProvider component from react-stripe-elements so that Elements component in Checkout has access to the Stripe instance...
    return (<div className={classes.root}>
        <Grid container spacing={8}>
            <Grid item xs={6} sm={6}>

                <CartItems checkout={checkout}
                    setCheckout={showCheckout} />
            </Grid>
            {checkout &&
                <Grid item xs={6} sm={6}>

                    <StripeProvider apiKey={config.stripe_test_api_key}>
                        <Checkout />
                    </StripeProvider>
                </Grid>}
        </Grid>
    </div>)
}