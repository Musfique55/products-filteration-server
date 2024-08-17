const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
require('dotenv').config();
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const e = require('express');
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

    app.get('/allproducts',async(req,res) => {
        const result = await productsDB.find().toArray();
        res.send(result)
    })
   
    app.get('/products',async(req,res) => {
        const page = (parseInt(req.query.page)-1);
        const size = parseInt(req.query.size);
        const category = req.query.category;
        const price = parseInt(req.query.price);
        const type = req.query.type;
        const sort = req.query.sort;
        
        let query = {};
    
            if(category && type === 'brand'){
                query = {
                    brandName : category,
                    price : { $gt : price}
                };
            }else if(category && type === 'category'){
                query = {
                    category : category ,
                    price : { $gt : price}
                };
            }
            else{
               query = { price : { $gt : price} }
            }
        
        let options = {} 
        
        if(sort === 'pricelow'){
            options = {
                sort :{ price : 1}
            }
        }else if(sort === 'pricehigh'){
            options = {
                sort :{ price : -1}
            }
        }else if(sort === 'date'){
            options = {
                sort : {creationDate : -1}
            }
        }
        
        const skipped = page * size;
        const result = await productsDB.find(query,options).skip(skipped).limit(size).toArray();
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