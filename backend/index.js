
const express = require("express");
const cors = require("cors");
const allrouter= require("./routes/allrouter");

const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/search", allrouter);

                                                                                                                
app.listen(port, () => {
    console.log(`Server is running on port : ${port}`);
});
