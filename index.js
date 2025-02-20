const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const PORT = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = process.env.url;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // // Send a ping to confirm a successful connection

    const tasksCollection = client.db("TaskManagement").collection("tasks");
    app.get('/tasks', async (req, res) => {
        const result = await tasksCollection.find().toArray();
        res.send(result)
      })
      // post task
      app.post('/tasks', async (req, res) => {
        const tasks = req.body;
        console.log(tasks);
        const result = await tasksCollection.insertOne(tasks);
        res.send(result);
      })
      

    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Task Management server is running...");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
