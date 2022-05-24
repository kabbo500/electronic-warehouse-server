const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ky2vn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('parts_manufacturing').collection('products');
        const reviewCollection = client.db('parts_manufacturing').collection('reviews');
        const bookingCollection = client.db('parts_manufacturing').collection('bookings');

        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray(query);
            res.send(products);
        })

        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray(query);
            res.send(reviews);
        })

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);

        });


        //purchase collection
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);

        })

        //get order collection
        app.get('/booking', async (req, res) => {
            const customer = req.query.customer;
            const query = { customer: customer };
            const bookings = await bookingCollection.find(query).toArray();
            res.send(bookings);
        })

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello from parts manufacturing')
})

app.listen(port, () => {
    console.log(`manufacturing app listening on port ${port}`)
})