import express from "express";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
const app = express();
const port = 4000;

// Middleware to parse JSON requests
app.use(express.json());
dotenv.config();

const uri = process.env.STRING_URI;

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
      // Connect the client to the server
      await client.connect();
  
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
  
      // Define the collection
      const database = client.db("blog");  // "blog" is the database name
      const collection = database.collection("posts"); // "posts" is the collection name
  
      // Route to get all items
      app.get('/api/items', async (req, res) => {
        try {
          const items = await collection.find().toArray();
          res.json(items);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      });
  
      // Route to get a specific item by ID
      app.get('/api/items/:id', async (req, res) => {
        try {
          const item = await collection.findOne({ _id: new MongoClient.ObjectID(req.params.id) });
          if (!item) {
            return res.status(404).json({ message: "Item not found" });
          }
          res.json(item);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      });

      // Route to create a new item
      app.post('/api/items', async (req, res) => {
        try {
          const newItem = req.body; // Get data from the request body
          const result = await collection.insertOne(newItem);
          res.status(201).json(result); // Respond with the created item
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      });
  
      // Start the server
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    } catch (err) {
      console.error("Failed to connect to MongoDB:", err);
    }
  }
  
  // Run the connection function
  run().catch(console.dir);