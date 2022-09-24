const express = require("express");
const { MongoClient } = require("mongodb");

// const fileUpload = require("express-fileupload");
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// app.use(fileUpload());

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

      // Order POST API
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
      //GET API
      app.get("/manageplans/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: ObjectId(id) };
         const user = await AddOrderCollection.findOne(query);
         res.send(user);
      });
      //UPDATE API
      app.put("/manageplans/:id", async (req, res) => {
         const id = req.params.id;
         const updatedStatus = req.body;
         console.log(updatedStatus);
         const filter = { _id: ObjectId(id) };
         const options = { upsert: true };
         const updateDoc = {
            $set: {
               status: "approved",
            },
         };
         const result = await AddOrderCollection.updateOne(
            filter,
            updateDoc,
            options
         );
         console.log("updating", id);
         res.json(result);
      });
      //
      // app.get("/file/:filename", async (req, res) => {
      //    try {
      //       const file = await gfs.files.findOne({
      //          filename: req.params.filename,
      //       });
      //       const readStream = gfs.createReadStream(file.filename);
      //       readStream.pipe(res);
      //    } catch (error) {
      //       res.send("not found");
      //    }
      // });

      //POST ADD PLAN API
      // app.post("/addplan", async (req, res) => {

      //    // const newPlan = req.body;

      //    // console.log("got new user", req.body);
      //    // console.log("added user", result);
      //    // res.json(result);
      // });

      // app.post("/addplan", (req, res) => {
      //    var imgg = req.files.img;
      //    console.log(img);
      //    imgg.mv("public/pimg" + imgg.this.name, function (err) {
      //       if (err) {
      //          res.json({ status: "file not uploaded" });
      //       } else {
      //          var insObj = {
      //             name: req.body.name,
      //             description: req.body.description,
      //             price: req.body.price,
      //             img: imgg.name,
      //          };
      //          const result = ManageCollection.insertOne(insObj);
      //          res.json({ status: "Record Inserted successfully" });
      //       }
      //    });
      // });

      // POST API
      app.post("/addplan", async (req, res) => {
         var newPlan = req.body;
         const result = await ManageCollection.insertOne(newPlan);
         console.log("got new user", req.body);
         console.log("added user", result);
         res.json(result);
      });

      // DELETE PLAN API

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
