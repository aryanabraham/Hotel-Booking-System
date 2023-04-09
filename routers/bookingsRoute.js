const express = require('express');
const router = express.Router();
const Booking = require("../models/booking");
const Room = require("../models/room");
const moment = require('moment');
const stripe = require('stripe')('Secret Key');
const { v4: uuidv4 } = require('uuid');

router.post("/booking", async(req,res)=>{

    const [room, userid, fromdate,todate,totalamount, totaldays, token] = req.body;

    try{
        const customer = await stripe.customers.create({
            email : token.email,
            source : token.id
        })

        const payment = await stripe.charges.create({
            amount : totalamount * 100,
            customer : customer.id,
            currency : 'inr',
            receipt_email : token.email
        },{
            idempotencyKey : uuidv4()
        })

        if(payment){
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
                
                const roomtemp = await Room.findOne({_id : room._id});

                roomtemp.currentbookings.push({
                    roomid : booking._id,
                    fromdate : moment(fromdate).format('DD-MM-YYYY'),
                    todate : moment(todate).format('DD-MM-YYYY'),
                    userid : userid,
                    status : booking.status,
                });

                await roomtemp.save();
            
               
        }

        res.send("Payment Success, Your Room is booked");
    }catch(error){
        return res.status(400).json({error});
    }    
});


router.post("/getbookingsbyuserid", async(req,res) => {
    const userid = req.body.userid;

    try{
        const bookings = await Booking.find({userid : userid});
        res.send(bookings);
    }catch(error){
        return res.status(400).json({error});
    }
})

module.exports = router;