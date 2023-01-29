const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


// mongodb connect
// user:task
// pass:ynK47inoZqoaDaO1

const uri = "mongodb+srv://task:ynK47inoZqoaDaO1@cluster0.bstay.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const sectorCollection = client.db('task').collection('sectors');
        const profileCollection = client.db('profile').collection('profiles')



        // get sectors 
        app.get('/sectors', async (req, res) => {
            const query = {}
            const cursor = sectorCollection.find(query);
            const sectors = await cursor.toArray();
            res.send(sectors);
        });
        //    add sectors
        app.post('/sectors', async (req, res) => {
            const sector = req.body;
            console.log(sector);
            const result = await sectorCollection.insertOne(sector)
            res.send(result);
        })
        // make profiles
        app.post('/profiles', async (req, res) => {

            const profile = req.body;
            const result = await profileCollection.insertOne(profile);
            res.send(result);
        })

        // get profile
        app.get('/profiles', async (req, res) => {
            const query = {}
            const cursor = profileCollection.find(query);
            const profiles = await cursor.toArray();
            res.send(profiles);
        })

        // get update  id
        app.get('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const profile = await profileCollection.findOne(query);
            res.send(profile);
        })


        // uapdate store profile

        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const profile = req.body;
            const option = { upsert: true };
            const updatedProfile = {
                $set: {
                    name: profile.name,
                    sector: profile.sector,
                    agree: profile.agree
                }
            }
            const result = await profileCollection.updateOne(filter, updatedProfile, option);
            res.send(result);

        })


    }
    finally {

    }

}
run().catch(err => console.log(err));



app.get('/', (req, res) => {
    res.send('hello from node mongo crud server');

})

app.listen(port, () => {
    console.log(`listening to port${port}`)
})



// ----------------------------------------------------End-----------------------------------------------------------// 
