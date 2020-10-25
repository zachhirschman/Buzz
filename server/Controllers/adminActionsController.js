module.exports ={
   getPostDataForRoom:((req,res,next)=>{
    const db = req.app.get("db");
    const {room_id} = req.params;
    db.getAdminPostData([room_id]).then(response =>{
        res.status(200).json(response)
    })
   }),
   createDrinkDeal:((req,res) =>{
    const db = req.app.get("db");
    const {description} = req.body;
    db.create_drink_deal(["XKDF043JDFL",965,description]).then(response =>{
        res.status(200).json(response)
    }) 
   })
}