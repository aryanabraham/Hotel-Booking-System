const express = require('express');
const router = express.Router();
const Booking = require("../models/booking");
const Room = require("../models/room");
const moment = require('moment');
require('dotenv').config()
const stripe = require('stripe')(process.env.SECRET_KEY);
const { v4: uuidv4 } = require('uuid');

router.post("/bookroom", async(req,res)=>{

    // console.log(req.body);
    // const {room, userid, fromdate,todate,totalamount, totaldays, token} = req.body;

    const room = req.body.room;
    const userid = req.body.user;
    const fromdate = req.body.fromdate;
    const todate = req.body.todate;
    const totalamount = req.body.totalamount;
    const totaldays = req.body.totaldays;
    const token = req.body.token;
    // console.log(room);
    // console.log(userid);
    // console.log(fromdate);
    // console.log(todate);
    // console.log(totalamount);
    // console.log(totaldays);
    // console.log(token);
    try{
        const customer = await stripe.customers.create({
            email : token.email,
            source : token.id
        });
        // console.log(customer.source);

        const payment = await stripe.paymentIntents.create({
            amount : totalamount * 100,
            customer : customer.id,
            currency : 'inr',
            receipt_email : customer.email
        },{
            idempotencyKey : uuidv4()
        })
        console.log(payment);

        if(payment){
                const newbooking = new Booking({
                    room : room.name,
                    roomid : room._id,
                    userid,
                    fromdate : moment(fromdate).format('DD-MM-YYYY'),
                    todate : moment(todate).format('DD-MM-YYYY'),
                    totalamount,
                    totaldays,
                    transactionId : token.id
                });
        
                const booking = await newbooking.save();
                
                const roomtemp = await Room.findOne({_id : room._id});

                roomtemp.currentbookings.push({
                    bookingid : booking._id,
                    fromdate : moment(fromdate).format('DD-MM-YYYY'),
                    todate : moment(todate).format('DD-MM-YYYY'),
                    userid : userid,
                    status : booking.status,
                });

                await roomtemp.save();
            
               
        }

        res.send("Payment Success, Your Room is booked");
    }catch(error){
        console.log(error);
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
});

router.post("/cancelbooking", async (req,res) =>{
    const {bookingid, roomid} = req.body;

    try{
        const bookingitem = await Booking.findOne({_id : bookingid});

        bookingitem.status = 'cancelled';
        await bookingitem.save();
        const room = await Room.findOne({_id : roomid});
        const bookings = room.currentbookings;

        const temp = bookings.filter(booking => booking.bookingid.toString() !== bookingid);
        room.currentbookings = temp;

        await room.save();

        res.send('Your booking cancelled successfully');
    }catch(error){
        return res.status(400).json({error});
    }
});

router.get("/getallbookings", async (req,res)=>{
    try{
        const bookings = await Booking.find();
        res.send(bookings);
    }catch(error)
    {
        return res.status(400).json({error});
    }
});

module.exports = router;
