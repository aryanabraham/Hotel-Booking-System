const express = require('express');

const app = express();
const db = require('./db');
const roomsRoute = require('./routers/roomsRoute');
const usersRoute = require('./routers/usersRoute');

app.use('/api/rooms', roomsRoute);
app.use('/api/users', usersRoute);



const port = process.env.PORT || 5000;





app.listen(port, ()=>{console.log(`Server running on prot ${port}`)});