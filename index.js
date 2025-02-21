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
    const userCollection = client.db("TaskManagement").collection("user");
    app.get('/tasks', async (req, res) => {
        const result = await tasksCollection.find().toArray();
        res.send(result)
      })
      
      app.post("/users", async (req, res) => {
        const { email, displayName, photoURL } = req.body;
        try {
          const existingUser = await UserCollection.findOne({ email });
          if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
          }
          const result = await UserCollection.insertOne({
            email,
            displayName,
            photoURL,
            role: "customer",
          });
          res.json({ message: "User created successfully", result });
        } catch (error) {
          res.status(500).json({ error: "Error creating user" });
        }
      });
      app.get("/oneuser", async (req, res) => {
        const email = req.query.email;
        try {
          const user = await UserCollection.findOne({ email });
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
          res.json(user);
        } catch (error) {
          res.status(500).json({ error: "Error fetching user" });
        }
      });
      app.post('/tasks', async (req, res) => {
        const tasks = req.body;
        console.log(tasks);
        const result = await tasksCollection.insertOne(tasks);
        res.send(result);
      })

      app.get("/tasks/:id", async (req, res) => {
        const id = req.params.id
        const query = { _id: new ObjectId(id) }
        const result = await tasksCollection.findOne(query)
        res.send(result)
      })

      // app.post("user")
  
      // update task
      app.put('/tasks/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) }
        const options = { upsert: true };
        const updatedTask = req.body;
        const posts = {
          $set: {
            title: updatedTask.title,
            description: updatedTask.description,
            deadline: updatedTask.deadline,
            priority: updatedTask.priority,
            email: updatedTask.email
          }
        }
        const result = await tasksCollection.updateOne(filter, posts, options);
        res.send(result);
      })
  
      // delete task 
      app.delete('/tasks/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await tasksCollection.deleteOne(query);
        res.send(result);
      })
  
      // task ongoing
      app.patch("/tasks/ongoing/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
          $set: {
            status: "Ongoing",
          },
        };
        const result = await tasksCollection.updateOne(filter, updatedDoc);
        res.send(result);
      });
  
      // task complete
      app.patch("/tasks/complete/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
          $set: {
            status: "Completed",
          },
        };
        const result = await tasksCollection.updateOne(filter, updatedDoc);
        res.send(result);
      });


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
