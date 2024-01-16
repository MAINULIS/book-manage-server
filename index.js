const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Books data are coming')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9fxhf2q.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const bookCollection = client.db("bookManager").collection("books");

    // 1. insert(create) a data to db
    app.post("/upload-book", async(req, res) => {
        const book = req.body;
        console.log(book)
        const result = await bookCollection.insertOne(book);
        res.send(result)
    })

    // 2. get(read) all data
    app.get("/all-books", async(req, res) =>{
        const books = bookCollection.find();
        const result = await books.toArray();
        res.send(result)
    })

    // 3. update a date
    app.patch("/books/:id", async(req, res) =>{
        const id = req.params.id;
        const updatedBook = req.body;
        const filter = { _id: new ObjectId(id)};
        const updatedDoc ={
            $set:{
                ...updatedBook
            }
        }
        const result  = await bookCollection.updateOne(filter, updatedDoc);
        res.send(result)
    })
    // 4. delete an element
    app.delete("/books/:id", async(req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const result = await bookCollection.deleteOne(filter);
        res.send(result);
    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);



app.listen(port, () => {
    console.log(`Books server is running on ${port}`)
})