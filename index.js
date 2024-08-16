const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
require('dotenv').config();
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const category = req.query.category;
        const type = req.query.type;
        console.log(type);
        const query = {};
        if(type === 'brand'){
            query.brandName = category;
        }else if(type === 'brand'){
            query.category = category;
        }
        
        const skipped = page * size;
        const result = await productsDB.find(query).skip(skipped).limit(size).toArray();
        res.send(result); 
    })
    app.get('/products/:category',async(req,res) => {
        const category = req.params.category;
        const query = {
            brandName : category
        }
        const result = await productsDB.find(query).toArray();
        res.send(result);
    })

    // products count

    app.get('/products-count',async(req,res) => {
        const count = await productsDB.estimatedDocumentCount();
        res.send({count})
    })

    // products suggestion

    app.get('/suggestions',async(req,res) => {
        const query = req.query.q;
        const result = await productsDB.find({productName : new RegExp(query,"i")}).limit(5).toArray();
        res.send(result)
    })
    app.get('/search',async(req,res) => {
        const query = req.query.q;
        const result = await productsDB.findOne({productName : new RegExp(query,"i")});
        res.send(result);
    })
    app.get('/search/:id',async(req,res) => {
        const query = req.params.id;
        const cursor = {
            _id : new ObjectId(query)
        } 
        const result = await productsDB.findOne(cursor);
        res.send(result)
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