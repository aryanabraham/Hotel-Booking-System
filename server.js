const express = require('express');

const app = express();
const db = require('./db');
const port = process.env.PORT || 5000;





app.listen(port, ()=>{console.log(`Server running on prot ${port}`)});