module.exports ={
   getPostDataForRoom:((req,res,next)=>{
    const db = req.app.get("db");
    const {room_id} = req.params;
    db.getAdminPostData([room_id]).then(response =>{
        console.log("Successful response: ", response)
        res.status(200).json(response)
    })
   }) 
}