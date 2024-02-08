 const express = require("express");
 const app = express();
require("dotenv").config();
 const PORT = process.env.PORT;
 const userRoute = require("./routes/User");
const contactRoute = require("./routes/Contact");
 const profileRoute = require("./routes/Profile");
 const paymentRoute = require("./routes/Payments");
 const courseRoute = require("./routes/Course");
 const dbConnect = require("./config/database");
 const cloudinaryConnect = require("./config/cloudinary");
 const cookieParser = require("cookie-parser");
 const cors = require("cors");
app.use(express.json());
app.use(cookieParser());
const fileUpload = require("express-fileupload");




app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://codify-frontend-one.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});



app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);




app.use(
    cors({
        origin : "https://codify-frontend-one.vercel.app",
        credentials : true,
        methods : ["GET" , "POST" , "PUT" , "DELETE"],

    })
)

app.options("" ,      cors({
        origin : "https://codify-frontend-one.vercel.app/",
        credential : true,
        methods : ["GET" , "POST" , "PUT" , "DELETE"],

    }) ) 


app.listen(PORT, () => {
  console.log(`Started Running At Port ${PORT}`);
});


 dbConnect();
 cloudinaryConnect();

app.use("/api/v1/auth",  userRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/profile", profileRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/course", courseRoute);





app.get("/", (request, response) => {
  return response.json({
    success : true,
    message : "Your Server is Up and Running Successfully !!........."
  })
  
})

