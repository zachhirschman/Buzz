
const userController = require('./Controllers/userController');
const authController = require("./Controllers/authController")
const adminController = require("./Controllers/adminActionsController");

//Require Packages
const express = require("express")
const bodyParser = require("body-parser")
const massive = require("massive")
const session = require("express-session")
const roomsController = require("./Controllers/roomsController")
require("dotenv").config()

//Build server
const app = express()
const server = require("http").createServer(app)
const io = require("socket.io")(server)

//app provisions
app.use(bodyParser.json())
app.use(express.static(`${__dirname}/../build`));
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false
}))

//testing location info for db 
// app.post("/venues",roomsController.postBusiness)
// plotting from db 
// app.get("/dbvenues", roomsController.getBusiness) 


//auth endpoint
app.get("/auth", authController.login)
app.get("/api/user-data", authController.getUserData)
app.get('/getUserSession', authController.getUserData)
app.get('/getAdminPosts', authController.getAdminData)

//Stripe
app.post("/stripe", (req, res) => {
    console.log("Stripe has hit index.js")
    const stripeToken = req.body;
    console.log(stripeToken)
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
    
      stripe.charges.create({
        amount: 1000,
        currency: 'usd',
        description: 'Example Charge',
        source: stripeToken.body
        // source: stripeToken.id
      }, function(err, charge) {
          console.log('charge', charge)
          if(err){
            res.send({
                success: false,
                message: 'Error'
            })
          } else {
            res.send({
            success: true,
            message: 'Success'
         })
          }
      });
  
  });

   

//Username endpoint 
app.post("/Username", userController.getUsername)

//Connect to Database
massive(
    process.env.CONNECTION_STRING
).then(db => {
    console.log("Connected to Database")
    app.set("db", db)
}).catch(error => { console.log(error) })

//Endpoints for rooms
app.get("/getPosts/:id", roomsController.getRoomData)
app.get("/getComments/:id", roomsController.getComments)
app.post("/newPost", roomsController.newPost)
app.get('/getRooms', roomsController.getRooms)
app.get("/getDrinkDeals/:id", roomsController.getDrinkDeals)

//User endpoint
app.post('/logout', userController.logoutUser);
app.get('/getUserDrinks/:id', userController.getDrinksForUser)
app.get('/getUserSession', authController.getUserData)
app.delete('/deleteDrink/:id/:userId', userController.deleteUserDrinks)
app.put(`/getusername/:user/:username`,userController.getUsername )

//Admin endpoints
app.get('/admin/get-postData/:room_id', adminController.getPostDataForRoom)

//Sockets
io.sockets.on('connection', (socket) => {
    const db = app.get("db")
    console.log("User Connected")

    socket.join("Home")

    // io.in("Home").emit("NewPost", {})
    socket.on("NewPost", body => {
        const { poster_username, poster_pic, post_content, post_img, upvotes, downvotes, drinks_given, room_id, poster_id } = body
        console.log("RECIEVED POST DATA ON BACKEND", body)
        db.newPost([poster_username, poster_pic, post_content, post_img, upvotes, downvotes, drinks_given, room_id, poster_id]).then(response => {
            console.log("Response after adding message: ", response)
            io.in(room_id).emit("Newmessage", response)
        })
    })
    socket.on("NewComment", body => {
        console.log("Got body", body)
        const { comment_message, post_id, commenter_user_name, commenter_img, comment_upvotes, comment_downvotes, room_id } = body
        db.newComment([post_id, commenter_user_name, comment_message, comment_upvotes, comment_downvotes, commenter_img, room_id]).then(allComments => {
            io.in(room_id).emit("AllComments", allComments)
        })
    })

    socket.on('JoinedRoom', body => {
        const { room_id } = body
        console.log(room_id)
        socket.join(room_id)

        db.join_user_to_room(room_id).then(room => {
            db.getPostsinRoom(room_id).then(roomData => {
                console.log("This is the found room data for room", room_id + "   " + roomData)
                io.in(room_id).emit('SendRoomData', roomData)
            })
        })
        socket.on("SendDrink", body => {
            console.log("Recieved Drink request", body)
            const { recipient_id, recipient, deal_description, coupon_code, sender_name, sender_id } = body
            db.send_drink(recipient_id, recipient, deal_description, coupon_code, sender_name, sender_id).then(drinks => {
                console.log(drinks)
                io.sockets.emit("NewDrinkSent", drinks[0])
            })
        })
    })

    //use .leave in the same way as .join? 
    socket.on('ExitedRoom', body => {
        const { room_id } = body;
        socket.leave(room_id)

        db.remove_user_from_room(room_id).then(room_id => {
            console.log('left room #', room_id)
            // io.sockets.emit()
        })
    })
    socket.on('UpvotePost', body =>{
            const db = app.get("db")
            db.upvote_post([body.post_id,body.room_id]).then(allPosts =>{
                io.sockets.emit("NewUpvote", allPosts)
            })
    })
    socket.on("DownvotePost", body =>{
        db.downvote_post([body.post_id,body.room_id]).then(allPosts =>{
            io.sockets.emit("NewDownvote", allPosts)
        })
    })
    socket.on("CommentUpvote", body =>{
        db.upvote_comments([body.comment_id,body.room_id]).then(allComments =>{
            io.sockets.emit("NewCommentUpvote", allComments)
        })
    })
    socket.on("CommentDownvote", body =>{
        console.log("BODY RECIEVED: ", body)
        db.downvote_comments([body.comment_id,body.room_id]).then(allComments =>{
            console.log("ALL COMMENTS: ", allComments)
            io.sockets.emit("NewCommentDownvote", allComments)
        })
    })
})


//Server listen
const port = process.env.PORT
server.listen(port, () => console.log(`Server listening on port ${port}`));

