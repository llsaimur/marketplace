//we take the reference from server.js

import Auction from '../models/auction.model'

//this initilaize socket.io and then listen on the connection event for incoming socket messages from clients
export default (server) => {
    const io = require('socket.io').listen(server)

    //we update the socket event handlers in the socket connection listener to add a handler for the new bid socket msg
    io.on('connection', function(socket){
        socket.on('join auction room', data => {
            socket.join(data.room)
        })
        socket.on('leave auction room', data => {
            socket.leave(data.room)
        })
        socket.on('new bid', data => {
            bid(data.bidInfo, data.room)
        })
    })

    //when the socket receives the emitted new bid msg, we use the attached data to update the specified auction with the new bid info
    //this bid function take new bid detials and auction id as arguments
    //findOneAndUpdate on the auction collection to find auction to be updated, we also check the new bid amount is larger than the last bid at pos 0 of the bids array in the collection doc
    //if auction is found that matched the provided id and also meets this condition, this auctions is updated by pushing the new bid in the the first pos of the bids array 

    //after the update action in db, we emit the new bid msg over the socket.io conn to all the clietns curr connected to the corresponding auction room. 
    //on the client-side we capture this msg in a socket event handler code and update view with latest bids

    
    
    const bid = async (bid, auction) => {
        try {
          let result = await Auction.findOneAndUpdate({_id:auction, $or: [{'bids.0.bid':{$lt:bid.bid}},{bids:{$eq:[]}} ]}, {$push: {bids: {$each:[bid], $position: 0}}}, {new: true})
                                  .populate('bids.bidder', '_id name')
                                  .populate('seller', '_id name')
                                  .exec()
            io
            .to(auction)
            .emit('new bid', result)
        } catch(err) {
          console.log(err)
        }
    }
}

//when a new client first connects and then disconnects to the socket connection, we will subscribe and unsubscribe the client socket to a given channel...
//the channel will be identified by the auction ID that will be passed in the data.room property from the client, this way we have a different channel or room for each auction...
// to receive communication from clients over sockets