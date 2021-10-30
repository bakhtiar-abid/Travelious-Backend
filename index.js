const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

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
      const ManageCollection = client.db("ManageOrders").collection("Orders");
      const AddOrderCollection = client.db("addOrder").collection("orders");

      //GET AllPlans API
      app.get("/allplans", async (req, res) => {
         const result = await ManageCollection.find({}).toArray();
         res.send(result);
         console.log(result);
      });

      //GET Single Plan API
      app.get("/plan/:id", async (req, res) => {
         const id = req.params.id;
         console.log("getting specific plan", id);
         const query = { _id: ObjectId(id) };
         const service = await ManageCollection.findOne(query);
         res.json(service);
      });

      // POST API
      app.post("/orders", async (req, res) => {
         const orders = req.body;
         console.log("hit the post api", orders);
         const result = await AddOrderCollection.insertOne(orders);
         console.log(result);
         res.json(result);
      });

      //All Plans GET API
      app.get("/manageplans", async (req, res) => {
         const result = await AddOrderCollection.find({}).toArray();
         res.send(result);
         console.log(result);
      });

      // My Plans

      app.get("/myplans/:email", async (req, res) => {
         const result = await AddOrderCollection.find({
            email: req.params.email,
         }).toArray();
         res.send(result);
      });

      // delete plan

      app.delete("/deleteplan/:id", async (req, res) => {
         console.log(req.params.id);
         const result = await AddOrderCollection.deleteOne({
            _id: ObjectId(req.params.id),
         });
         res.send(result);
      });
   } finally {
      // await client.close();
   }
}

run().catch(console.dir);

app.get("/", (req, res) => {
   res.send("Server is running");
});

app.get("/check", (req, res) => {
   res.send("Travelious is running");
});

app.listen(port, () => {
   console.log("Server running at port", port);
});
