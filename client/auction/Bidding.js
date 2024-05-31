import React, {useState, useEffect}  from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import auth from '../auth/auth-helper'
import Grid from '@material-ui/core/Grid'
import {makeStyles} from '@material-ui/core/styles'

//this component takes the auction object, the justEnded value, and an updateBids function as props from the Auction componenent and uses theses in the bidding process


//integrate sockets using the Socket.IO client-side library
const io = require('socket.io-client')
const socket = io()

const useStyles = makeStyles(theme => ({
    bidHistory: {
        marginTop: '20px',
        backgroundColor: '#f3f3f3',
        padding: '16px'
    },
    placeForm: {
        margin: '0px 16px 16px',
        backgroundColor: '#e7ede4',
        display: 'inline-block'
    },
    marginInput: {
        margin: 16
    },
    marginBtn: {
        margin: '8px 16px 16px'
    }
}))

//we utilized the useEffect hook, and the initilized socket to emit the auction room joining and auction room leaving socket events when the componenet mounts and unmounts...
//we pass the current auction's ID as the data.room value with these emitted socket events...
//these events will be received by the server socket connection, resultin in subscription or unsubscription of the client to the given aution room...

//this allows the clients and the server are able to communicate in real-time over sockets...
export default function Bidding (props) {
    const classes = useStyles()

    //before adding the form we initialized the bid value in the state
    const [bid, setBid] = useState('')

    const jwt = auth.isAuthenticated()


    //useEffect hook componenent when it loads and renders
    //we will also remove the listener with socket.off() in the useEffect cleanup when the component unloads
    useEffect(() => {
        socket.emit('join auction room', {room: props.auction._id})
        return () => {
            socket.emit('leave auction room', {
              room: props.auction._id
            })
          }
    }, [])

    useEffect(() => {
        socket.on('new bid', payload => {
          props.updateBids(payload)
        })
        return () => {
            socket.off('new bid')
        }
    })


     //add a change handling fucktion for the form input,
    const handleChange = event => {
        setBid(event.target.value)
    }

    //construct a bid obj containing the new bid's details,
    //amount,time,user ref
    //this is emitted to server over socket communication thats established for this aution room...
    const placeBid = () => {
        let newBid = {
            bid: bid,
            time: new Date(),
            bidder: jwt.user
        }
        socket.emit('new bid', {
            room: props.auction._id,
            bidInfo:  newBid
        })
        setBid('')
    }

     //keep track of the minimum bid amount allowed
     //this bid amount is determine by checkin the latest bid placed
     //oterwise it needs to be higher than the starting bid tht was set by the auction seller
    const minBid = props.auction.bids && props.auction.bids.length> 0 ? props.auction.bids[0].bid : props.auction.startingBid

    //the form elements for placing bid only render if the current dat is before the auctien end date
    //also check if the justEnded value is false so that the form can be hidden when the time ends in real-time as the timer counts down to 0
    //form elements will contain an input field, what min amount should be amd submit btn that disabled unless a valid bid amount is entered



    //the bidding history view will basically iterate over the bids array for the auction and display, amount, time, name for each bid obj found in array
    return(
        <div>
            {!props.justEnded && new Date() < new Date(props.auction.bidEnd) && <div className={classes.placeForm}>
                <TextField id="bid" label="Your Bid ($)"  
                        value={bid} onChange={handleChange} 
                        type="number" margin="normal"
                        helperText={`Enter $${Number(minBid)+1} or more`}
                        className={classes.marginInput}/><br/>
                <Button variant="contained" className={classes.marginBtn} color="secondary" disabled={bid < (minBid + 1)} onClick={placeBid} >Place Bid</Button><br/>
            </div>}
            <div className={classes.bidHistory}>
                <Typography variant="h6">All bids</Typography><br/>
                <Grid container spacing={4}>
                    <Grid item xs={3} sm={3}>
                        <Typography variant="subtitle1" color="primary">Bid Amount</Typography>
                    </Grid>
                    <Grid item xs={5} sm={5}>
                        <Typography variant="subtitle1" color="primary">Bid Time</Typography>
                    </Grid>
                    <Grid item xs={4} sm={4}>
                        <Typography variant="subtitle1" color="primary">Bidder</Typography>
                    </Grid>
                </Grid>    
                    {props.auction.bids.map((item, index) => {
                        return <Grid container spacing={4} key={index}>
                            <Grid item xs={3} sm={3}><Typography variant="body2">${item.bid}</Typography></Grid>
                            <Grid item xs={5} sm={5}><Typography variant="body2">{new Date(item.time).toLocaleString()}</Typography></Grid>
                            <Grid item xs={4} sm={4}><Typography variant="body2">{item.bidder.name}</Typography></Grid>
                        </Grid>
                    })}
                
            </div>
        </div>
    )
    // once msg has been emitted over the socker, we empty the input field with setBid(''),
    //then we update the bidding controller to receive and handle this new bid message that been sent from the client
}