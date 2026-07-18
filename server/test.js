import mongoose from "mongoose";

mongoose.connect("mongodb+srv://km9423230_db_user:OIdb8i5sErX1263g@cluster0.uz3hp1l.mongodb.net")
.then(()=>console.log("Connected"))
.catch(err=>console.log(err));