const path =require("path");

const express = require('express');

const dotenv = require('dotenv');
const mongoose = require ('mongoose');
const cors = require('cors')
const compression = require('compression')


const app = express();
app.use(cors());
app.use(compression());


const clientRouter= require("./routes/client");
const authRouter= require('./routes/auth');
const productRouter= require("./routes/product");
const orderRouter= require("./routes/order");
const sectionRouter= require("./routes/section");
const reportsRouter= require("./routes/report");
const designRouter= require("./routes/design");
const designerRouter= require("./routes/designer");


const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
//fil env for scret info 
dotenv.config();


//conect db
mongoose.connect(process.env.mongoUrl)
.then(() =>{
    console.log(`connected to mongodb `);
})




app.use(express.json());
app.use(express.static(path.join(__dirname,'uploads')));


app.use("/api/auth",authRouter);
app.use("/api/clients",clientRouter);
app.use("/api/products",productRouter);
app.use("/api/orders",orderRouter);
app.use("/api/sections",sectionRouter);
app.use("/api/reports",reportsRouter);
app.use("/api/design",designRouter);
app.use("/api/designer",designerRouter);


//meddleware  cach rout not in routes

app.all('*',(req,res,next) => {
    //creat error and send it to error handling middleware
    /*const err = new Error(`con't find this route: ${req.originalUrl}`);
    next(err.message);*/
    next(new ApiError(`con't find this route: ${req.originalUrl}`,400))
});


// Global Error Handling Middleware

app.use(globalError);


const server=app.listen( process.env.port||3000,()=>{
    console.log('app runnig')});

//err outside express middleware 
process.on("unhandledRejection",(err)=>{
    console.error(`Unhandled Rejection error: ${err.name}|${err.message}`);
    server.close(()=>{
        console.log("server closed");
        process.exit(1);
    });
})




