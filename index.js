const express = require('express')
const { MongoClient } = require('mongodb');
require("dotenv").config();
const ObjectId = require('mongodb').ObjectId

const cors = require("cors")

const app = express()
const port = process.env.PORT || 5000;

// middlewaer
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yz6m3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {



        await client.connect();
        const database = client.db('bikeStore')
        const bikeCollection = database.collection('bikes')
        const ordersCollection = database.collection('orders')


        // GET API 
        app.get('/bikes', async (req, res) => {
            const cursor = bikeCollection.find({})
            const bikes = await cursor.toArray()
            res.send(bikes)
        })

        // GET SINGLE API
        app.get('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            console.log("Geting specific service", id);
            const query = { _id: ObjectId(id) }
            const place = await bikeCollection.findOne(query)
            res.json(place);
        })

        // POST API 
        app.post('/bikes', async (req, res) => {
            const service = req.body;
            console.log("Hit the post api", service);
            const result = await bikeCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })


        // ADD order API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            res.json(result)
        })

        // GET orders API
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({})
            const services = await cursor.toArray();
            res.json(services);
        })
        // DELETE my order API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);

            res.json(result);

        })

        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: "Approved"
                }
            }
            const result = await ordersCollection.updateOne(filter, updateDoc)
            res.json(result)
        }
        )

    }

    finally {
        // await client.close();
    }

}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send("Running Bike Shop")
})

app.listen(port, () => {
    console.log("Running Bike Shop on port", port);
})