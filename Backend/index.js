const express = require('express');
require('./database/connectDB');
const cors = require("cors");
const noteRoute = require('./routes/noteRoutes');

const PORT = 4500;
const app = express();

app.use(cors(
    {
        origin: ["https://notes-mern-website-frontend.vercel.app"],
        methods: ["POST","GET","PUT","DELETE"],
        credentials: true
    }
));
app.use(express.json());
app.use('/', noteRoute);


app.listen(PORT,()=>{
    console.log(`Server is running on PORT: ${PORT}`);
});
