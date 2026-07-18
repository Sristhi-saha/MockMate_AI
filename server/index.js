import "../server/config/env.js"; // ✅ runs FIRST (not hoisted like normal imports)
import connectDB from "./config/connectDB.js";
import app from "./app.js";


connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log('Server is running at ',process.env.PORT);
      console.log(`Connected to MongoDB successfully `);
      
    });
  })
  .catch((error) => {
    console.log("MONGO DB connection failed !!!", error);
  });