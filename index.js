const express= require("express");
const dotenv= require("dotenv");
const database = require("./connect");
const accountsRouter= require("./Routers/accountsRouter");
const cors=require('cors');


dotenv.config();
database.connect();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/',accountsRouter);


app.listen(process.env.PORT,()=>{
    console.log("server running on port 8000")
})