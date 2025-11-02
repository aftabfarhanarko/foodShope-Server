const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4000;

// set midalwier
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://foodData:pkahONe4Sp4s7rza@clustermyfirstmongodbpr.2cecfoe.mongodb.net/?appName=ClusterMyFirstMongoDbProject";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// app.get("/", (req,res) => {
//     res.send("MY Server  is Running");
// })

async function run() {
  try {
    await client.connect();
    const foodShopData = client.db("foodData");
    const myFoodCollection = foodShopData.collection("foodProducat");
    const myUserCollection = foodShopData.collection("userDataSaved");
    const bidPriceCollection = foodShopData.collection("coustomerDibPrice");

    // User Saved Data Api Start
    app.get("/user", async (req, res) => {
      const result = await myUserCollection.find().toArray();
      res.send(result);
    });

    app.post("/user", async (req, res) => {
      const email = req.body.email;
      const query = {email: email};
      const exgistingUser = await myUserCollection.findOne(query);
      const data = req.body;
    
      if (exgistingUser) {
        res.send({ message: "This User Allready Login" });
      } else {
        const result = await myUserCollection.insertOne(data);
        res.send(result);
      }
      
    });

    app.patch("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = req.body;

      const seter = {
        $set: data,
      };

      const result = await myUserCollection.updateOne(query, seter);
      res.send(result);
    });
    // User Saved Data Api Closed

    // Food Producat All API Start
    app.get("/food", async (req, res) => {
      const result = await myFoodCollection.find().toArray();
      res.send(result);
    });

    app.get("/limet_producat", async (req, res) => {
      const quiery = myFoodCollection.find().limit(8);
      const result = await quiery.toArray(quiery);
      res.send(result);
    });

    app.post("/food", async (req, res) => {
      const data = req.body;
      const result = await myFoodCollection.insertOne(data);
      res.send(result);
    });

    app.get("/food/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myFoodCollection.findOne(query);
      res.send(result);
    });

    app.patch("/food/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = req.body;
      const seter = {
        $set: data,
      };
      const result = await myFoodCollection.updateOne(query, seter);
      res.send(result);
    });

    app.delete("food/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myFoodCollection.deleteOne(query);
      res.send(result);
    });
    // Food Producat All API Closed

    // Coustomer APi Start
    app.post("/price", async (req, res) => {
      const data = req.body;
      const result = await bidPriceCollection.insertOne(data);
      res.send(result);
    });

    app.get("/price", async (req, res) => {
      const query = {};
      if (req.query.email) {
        query.byer_email = req.email;
      }

      const result = await bidPriceCollection.findOne(query);
      res.send(result);
      console.log(query, result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`My Server Running This Port : ${port}`);
});
