const express = require('express');
const router = express.Router();
const Booking = require("../models/booking");
const room = require("../models/room");
const moment = require('moment');

router.post("/booking", async(req,res)=>{

    const [room, userid, fromdate,todate,totalamount, totaldays] = req.body;

    try{
        const newbooking = new Booking({
            room : room.name,
            roomid : room._id,
            userid,
            fromdate : moment(fromdate).format('DD-MM-YYYY'),
            todate : moment(todate).format('DD-MM-YYYY'),
            totalamount,
            totaldays,
            transactionId : '1234'
        });

        const booking = await newbooking.save();
        res.send('Room booked successfully')
    }catch(error){
        return res.status(400).json({error});
    }
});

module.exports = router;