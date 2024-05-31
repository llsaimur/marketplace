import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Divider from '@material-ui/core/Divider'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search'
import {list} from './api-product.js'
import Products from './Products'

const useStyles = makeStyles(theme => ({
  card: {
    margin: 'auto',
    textAlign: 'center',
    paddingTop: 10,
    backgroundColor: '#80808024'
  },
  menu: {
    width: 200,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 130,
    verticalAlign: 'bottom',
    marginBottom: '20px'
  },
  searchField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
    marginBottom: '20px'
  },
  searchButton: {
    minWidth: '20px',
    height: '30px',
    padding: '0 8px',
    marginBottom: '20px'
  }
}))

export default function Search(props) {
  const classes = useStyles()
  const [values, setValues] = useState({
      category: '',
      search: '',
      results: [],
      searched: false
  })
  const handleChange = name => event => {
    setValues({
      ...values, [name]: event.target.value,
    })
  }

  //makes a call to the search API using the list fetch method
  //the query param provided to the list method are the search text value, and the selected category value.
    //then results array received from the backend is set to the values in state and passed as a prop 
        // to the Products components
  const search = () => {
    if(values.search){
      list({
        search: values.search || undefined, category: values.category
      }).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          setValues({...values, results: data, searched:true})
        }
      })
    }
  }
  const enterKey = (event) => {
    if(event.keyCode == 13){
      event.preventDefault()
      search()
    }
  }

   //to render the matching products underneath the search form
    return (
      <div>
        <Card className={classes.card}>
          <TextField
            id="select-category"
            select
            label="Select category"
            className={classes.textField}
            value={values.category}
            onChange={handleChange('category')}
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
            margin="normal">
            <MenuItem value="All">
              All
            </MenuItem>
            { props.categories.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="search"
            label="Search products"
            type="search"
            //To detect that the Enter key was pressed, we use the onKeyDown attribute
            onKeyDown={enterKey}
            onChange={handleChange('search')}
            className={classes.searchField}
            margin="normal"
          />
          <Button variant="contained" color={'primary'} className={classes.searchButton} onClick={search}>
            <SearchIcon/>
          </Button>
          <Divider/>
         
          <Products products={values.results} searched={values.searched}/>
        </Card>
      </div>
    )
}
Search.propTypes = {
  categories: PropTypes.array.isRequired
}