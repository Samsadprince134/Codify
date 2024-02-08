const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB Connected Successfully");
    })
    .catch((error) => {
      console.log("Some Issue in DB Connection, Connection Failed");
      console.log("Error is --> ", error);

      process.exit(1);
    });
};

module.exports = dbConnect;
