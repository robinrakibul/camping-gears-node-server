const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
const { query } = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Server is running')
})

// mongodb connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ntqok.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        // collection in mongodb
        const itemsCollection = client.db('inventoryStock').collection('items');


        // auth jwt
        app.post('/login', async(req, res)=>{
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '1d'
            });
            res.send({accessToken});
        })


        // items API
        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = itemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        // searchId
        app.get('/items/:id', async(req, res) =>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const itemSearch = await itemsCollection.findOne(query);
            res.send(itemSearch);
        });
        
        // quantity reducing
        app.put('/items/:id',async (req,res)=>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const options = { upsert: true };
            const updateQuantity = {
                $set: {
                    quantity: req.body.setQuantity,
                },
            };
            const result = await itemsCollection.updateOne(query, updateQuantity, options);
            res.send(result);
        });

        // quantity restocking
        app.put('/items/:id',async (req,res)=>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const options = { upsert: true };
            const updateRestockQuantity = {
                $set: {
                    quantity: req.body.restockQuantity,
                },
            };
            const result = await itemsCollection.updateOne(query, updateRestockQuantity, options);
            res.send(result);
        });

        // add new item
        app.post('/additem', async(req, res) =>{
            const newItem = req.body;
            const result = await itemsCollection.insertOne(newItem);
            res.send(result);
        });

        // delete an item
        app.delete('/items/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await itemsCollection.deleteOne(query);
            res.send(result);
        });

        // myitems app.get
        app.get('/myitems', async(req, res) =>{
            const email = req.query.email;
            const query = {email: email}
            const cursor = itemsCollection.find(query);
            const myitems = await cursor.toArray();
            res.send(myitems);
        });
    }
    finally {

    }
}

run().catch(console.dir);


app.listen(port, () => {
    console.log('Listening to port', port);
})