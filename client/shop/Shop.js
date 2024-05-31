import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import {read} from './api-shop.js'
import Products from './../product/Products'
import {listByShop} from './../product/api-product.js'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  card: {
    textAlign: 'center',
    paddingBottom: theme.spacing(2)
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  subheading: {
    marginTop: theme.spacing(1),
    color: theme.palette.openTitle
  },
  bigAvatar: {
    width: 100,
    height: 100,
    margin: 'auto'
  },
  productTitle: {
    padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(1)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
    width: '100%',
    fontSize: '1.2em'
  }
}))

export default function Shop({match}) {
  const classes = useStyles()

  // retrive shop details with a fect call to our read API in a useEffect hook
    // and set received values to state
  const [shop, setShop] = useState('')
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')

  // this useEffect hook will only run when the shopId changes in the route params
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    listByShop({
      shopId: match.params.shopId
    }, signal).then((data)=>{
      if (data.error) {
        setError(data.error)
      } else {
        setProducts(data)
      }
    })
    read({
      shopId: match.params.shopId
    }, signal).then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setShop(data)
      }
    })

    return function cleanup(){
      abortController.abort()
    }

    //we add listByShop feth method in this hook to retrieve the relevant products and set it to state
  }, [match.params.shopId])
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    listByShop({
      shopId: match.params.shopId
    }, signal).then((data)=>{
      if (data.error) {
        setError(data.error)
      } else {
        setProducts(data)
      }
    })

    return function cleanup(){
      abortController.abort()
    }

  }, [match.params.shopId])


  //points to the route from where the logo img can be retrieved from db if img exists
    const logoUrl = shop._id
          ? `/api/shops/logo/${shop._id}?${new Date().getTime()}`
          : '/api/shops/defaultphoto'

            // retrieved shop data is set to state and rendered in the view to display name, logo and description
           //list of products in a shop will be displayed, Products component is given list of releveant products as props
              //searched prop checks whether this list is a result of a product search so appropriate messages can be rendered
    return (<div className={classes.root}>
      <Grid container spacing={8}>
        <Grid item xs={4} sm={4}>
          <Card className={classes.card}>
          
            <CardContent>
              <Typography type="headline" component="h2" className={classes.title}>
                {shop.name}
              </Typography>
              <br/>
              <Avatar src={logoUrl} className={classes.bigAvatar}/><br/>
                <Typography type="subheading" component="h2" className={classes.subheading}>
                  {shop.description}
                </Typography><br/>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={8} sm={8}>
          <Card>
            <Typography type="title" component="h2" className={classes.productTitle}>Products</Typography>
           
            <Products products={products} searched={false}/>
          </Card>
        </Grid>
      </Grid>
    </div>)
}