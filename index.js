
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()

const app = express()

const port = process.env.PORT || 5000


//  middlewear
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.9xgdj4e.mongodb.net/?retryWrites=true&w=majority`;

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
        const database = client.db("chocolatesDB");
        const chocolateCollection = database.collection("Chocolates");


        app.get('/chocolates', async (req, res) => {
            const chocolate = chocolateCollection.find()
            const result = await chocolate.toArray()
            res.send(result)
        })


        app.get('/chocolates/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const result = await chocolateCollection.findOne(filter)
            res.send(result)
        })

        app.put('/updateChocolate/:id', async (req, res) => {
            const id = req.params.id
            const chocolate = req.body
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedChocolate = {
                $set: {
                    name: chocolate.name, country: chocolate.country, category: chocolate.category,
                },
            }
            const result = await chocolateCollection.updateOne(filter, updatedChocolate, options)
            console.log(result)
            res.send(result)
        })

        app.post('/chocolates', async (req, res) => {
            const chocolate = req.body
            const result = await chocolateCollection.insertOne(chocolate)
            res.send(result)
        })

        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const result = await chocolateCollection.deleteOne(filter)
            res.send(result)

        })




        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('This Is Chocolate Server')
})

app.listen(port, () => {
    console.log(`This Server Port is ${port}`)
})