const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://alpesh29:pkJuwz7Ic2hqRkRH@cluster0.c5udgo2.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

    const bookCollection = client.db("bookInventory").collection("books");

    //For Add Book
    app.post("/upload-books", async (req, res) => {
      const data = req.body;
      const result = await bookCollection.insertOne(data);
      res.send(result);
    });

    //For Get All Book
    app.get("/get-allbooks", async (req, res) => {
      const allBooks = bookCollection.find();
      const result = await allBooks.toArray();
      res.send(result);
    });

    //For Find Book By Category
    app.get("/filter/:category", async (req, res) => {
      const category = req.params.category;
      const books = bookCollection.find({ category: category });
      const result = await books.toArray();
      res.send(result);
    });

    //For Get Book By ID
    app.get("/get-book/:id", async (req, res) => {
      const id = req.params.id;
      const book = await bookCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(book);
    });

    //For Update Book By ID
    app.patch("/update-book/:id", async (req, res) => {
      const id = req.params.id; //get ID from request url
      const data = req.body; //get data from request body
      const filter = { _id: new ObjectId(id) };
      updateData = {
        $set: { ...data }, // get data
      };
      const options = { upsert: true };
      const result = await bookCollection.updateOne(
        filter,
        updateData,
        options
      );
      res.send(result);
    });

    //For Delete Book By ID
    app.delete("/delete-book/:id", async (req, res) => {
      const id = req.params.id;
      const book = await bookCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(book);
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
