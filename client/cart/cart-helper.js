const cart = {

    //readt the cart array stored in localstorage and returns lenght of array
    itemTotal() {
      if (typeof window !== "undefined") {
        if (localStorage.getItem('cart')) {
          return JSON.parse(localStorage.getItem('cart')).length
        }
      }
      return 0
    },

    //the cart data stored in localSotrage contains an array of cart item obj, each containing product details, qty of the products added to cart, and id of shop it belongs to.
    addItem(item, cb) {
      let cart = []
      if (typeof window !== "undefined") {
        if (localStorage.getItem('cart')) {
          cart = JSON.parse(localStorage.getItem('cart'))
        }
        cart.push({
          product: item,
          quantity: 1,
          shop: item.shop._id
        })
        localStorage.setItem('cart', JSON.stringify(cart))
        cb()
      }
    },

    //takes index of product being updated in the cart array and the new qty value as params and updates the details stored in localstorage
    updateCart(itemIndex, quantity) {
      let cart = []
      if (typeof window !== "undefined") {
        if (localStorage.getItem('cart')) {
          cart = JSON.parse(localStorage.getItem('cart'))
        }
        cart[itemIndex].quantity = quantity
        localStorage.setItem('cart', JSON.stringify(cart))
      }
    },

    //to retrive the cart details stored in localstorage
    getCart() {
      if (typeof window !== "undefined") {
        if (localStorage.getItem('cart')) {
          return JSON.parse(localStorage.getItem('cart'))
        }
      }
      return []
    },
    //takes the index of product to be removed from the array, splices it out, and updates localStorage before returning the updated cart array
    removeItem(itemIndex) {
      let cart = []
      if (typeof window !== "undefined") {
        if (localStorage.getItem('cart')) {
          cart = JSON.parse(localStorage.getItem('cart'))
        }
        cart.splice(itemIndex, 1)
        localStorage.setItem('cart', JSON.stringify(cart))
      }
      return cart
    },

    //empty the cart in localStorage so that user an add new items to the cart and place a new order if desire,
    //removes the cart obj from localStorage and updates the state of the view by executin the callback passed to it from the placeOrder method where it is invoked..
    emptyCart(cb) {
      if (typeof window !== "undefined") {
        localStorage.removeItem('cart')
        cb()
      }
    }
  }
  
  export default cart