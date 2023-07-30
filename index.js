const express = require("express");
const cors = require("cors");

const app = express();

// Mongodb Import
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// Mongodb Codes: ------------------------------------------------------------------------------
const uri =
  "mongodb+srv://test1:jaGbjFkmmwZDXNr7@cluster0.p4ps1ct.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const usersCollection = client.db("usersDB").collection("users");

    // Get All users
    app.get("/users", async (req, res) => {
      const users = await usersCollection.find().toArray();
      res.send(users);
    });

    // Add a user
    app.post("/users", async (req, res) => {
      const data = req.body;
      const result = await usersCollection.insertOne(data);
      res.send(result);
    });

    // Update full user
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const update = {
        $set: data,
      };
      const filter = { _id: new ObjectId(id) };
      const result = await usersCollection.updateOne(filter, update);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello, world");
});

// Listening to app ------------------------------------------------------------------------------
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
