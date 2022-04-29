const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { query } = require('express');

// middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Server is running')
})

// mongodb connection

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ntqok.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
async function run() {
    try {
        await client.connect();
    }
    finally{

    }
}
    

app.listen(port, () => {
    console.log('Listening to port', port);
})