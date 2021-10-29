const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.port || 3001;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xztta.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

async function run() {
   try {
      await client.connect();
      console.log("successfully database connected");
      const database = client.db("online_Shop");
      const productCollection = database.collection("products");

      const orderCollection = database.collection("orders");

      //GET Products API
   } finally {
      // await client.close();
   }
}

run().catch(console.dir);

app.get("/adding", (req, res) => {
   res.send("Travelious is running");
});

app.listen(port, () => {
   console.log("Server running at port", port);
});
