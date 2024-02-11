const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware 
app.use(cors())
app.use(express.json())
app.use(cookieParser())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dvnw110.mongodb.net/?retryWrites=true&w=majority`;

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
        const todosCollection = client.db('todoDB').collection('todos')

        app.post('/todos', async(req, res) => {
            const newInfo = req.body;
            const result = await todosCollection.insertOne(newInfo);
            res.send(result)
        })
        app.get('/todos/:email', async (req, res) => {
            const email = req.params.email;
            const result = await todosCollection.find({ userEmail: email }).toArray()
            res.send(result)
        })
        app.delete('/todos/:id', async (req, res) => {
            const id = req.params.id;
            const result = await todosCollection.deleteOne({ _id: new ObjectId(id) })
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


app.get('/', (req, res) => {
    res.send('Todo Boss is running...')
})

app.listen(port, () => {
    console.log(`Todo Boss is running on port ${port}`)
})