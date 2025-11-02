const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4000;

// set midalwier
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://foodData:pkahONe4Sp4s7rza@clustermyfirstmongodbpr.2cecfoe.mongodb.net/?appName=ClusterMyFirstMongoDbProject";


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// app.get("/", (req,res) => {
//     res.send("MY Server  is Running");
// })

async function run() {
  try {
    await client.connect();
    const foodShopData = client.db("foodData");
    const myFoodCollection = foodShopData.collection("foodProducat");

    app.get("/food", async (req, res) => {
        const result = await myFoodCollection.find().toArray();
        res.send(result);
    })

    app.post("/food", async (req, res) => {
        const data = req.body;
        const result = await myFoodCollection.insertOne(data);
        res.send(result);
    })

    

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {}
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`My Server Running This Port : ${port}`)
})