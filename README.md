Marketplace application by incorporating a shopping cart functionality for buyers, a checkout process with credit card payments, and order management for sellers.
I integrated Stripe for processing credit card charges, demonstrating the seamless integration of third-party services with the MERN stack.
Additionally, optimized bulk write operations in MongoDB to efficiently update multiple documents in response to single API calls,
particularly beneficial for reducing stock quantities across multiple products during order placements.

Through these implementations, we showcased the flexibility and scalability of the MERN stack, enabling easy integration of payment processing,
offline storage in browsers, and efficient database operations for any MERN-based application.

I then augmented the Marketplace application by integrating an auctioning system featuring real-time bidding capabilities.
This involved creating an auction model to store auction and bidding data, and implementing CRUD operations for auctions,
including creation, editing, and deletion functionalities. Additionally, I developed views for listing auctions and viewing individual auctions,
complete with real-time updates and countdown timers for live auctions.

To achieve real-time updates, I utilized Socket.IO for bidirectional communication between clients and servers. This involved integrating Socket.IO on both the client-side
and server-side of the application to enable instantaneous communication and bidding updates. Through this process, I gained insights into using setTimeout
within React components using the useEffect hook.

***
To test out this project, clone it.
Once you have the code, go on terminal and type:
yarn
--this is to install all node modules/dependencies needed for the project...
run development
--this is to run the project, to open go on your browser and type http://localhost:3000/

