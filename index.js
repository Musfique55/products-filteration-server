const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
require('dotenv').config();
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jaoth1x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const productsDB = client.db("ProductsDB").collection("products");
   
    app.get('/products',async(req,res) => {
        const page = (parseInt(req.query.page)-1);
        const size = parseInt(req.query.size);
        const skipped = page * size;
        console.log(page,size);
        const result = await productsDB.find().skip(skipped).limit(size).toArray();
        res.send(result); 
    })

    // products count

    app.get('/products-count',async(req,res) => {
        const count = await productsDB.estimatedDocumentCount();
        res.send({count})
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res) => {
    res.send('running')
})
app.listen(port);