const express = require('express');

const app = express();
const db = require('./db');
const roomsRoute = require('./routers/roomsRoute');
const usersRoute = require('./routers/usersRoute');
const bookingsRoute = require('./routers/bookingsRoute');

app.use(express.json());

app.use('/api/rooms', roomsRoute);
app.use('/api/users', usersRoute);
app.use('/api/bookings', bookingsRoute);



const port = process.env.PORT || 5000;





app.listen(port, ()=>{console.log(`Server running on port ${port}`)});