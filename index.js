const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rgz3uon.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const postCollection = client.db("social-app").collection("posts");
        const aboutCollection = client.db("social-app").collection("about");
        const commentCollection = client.db("social-app").collection("comment");
        const reactionCollection = client.db("social-app").collection("reaction");

        app.get("/about", async (req, res) => {
            const query = {};
            const result = await aboutCollection.find(query).toArray();
            res.send(result);
        });

        //update about info
        app.put("/about/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const info = req.body;
            console.log(info);
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    name: info.name,
                    email: info.email,
                    university: info.university,
                    address: info.address,
                },
            };
            const result = await aboutCollection.updateOne(filter, updateDoc, option);
            res.send(result);
        });

        //send post in db
        app.post("/posts", async (req, res) => {
            const post = req.body;
            const result = await postCollection.insertOne(post);
            res.send(result);
        });
        // all post get
        app.get("/posts", async (req, res) => {
            const query = {};
            const result = await postCollection
                .find(query, { sort: { _id: -1 } })
                .toArray();
            res.send(result);
        });

        //single post for service details com
        app.get("/posts/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await postCollection.findOne(query);
            res.send(result);
        });

        //comment post
        app.post("/comment", async (req, res) => {
            const comment = req.body;
            const result = await commentCollection.insertOne(comment);
            res.send(result);
        });

        //single comment
        app.get("/comments/:id", async (req, res) => {
            const id = req.params.id;
            const query = { postId: id };
            const comments = await commentCollection.find(query).toArray();
            res.send(comments);
        });

        //comment post
        app.post("/reaction", async (req, res) => {
            const reaction = req.body;
            const result = await reactionCollection.insertOne(reaction);
            res.send(result);
        });

        //single comment
        app.get("/reaction/:id", async (req, res) => {
            const id = req.params.id;
            const query = { postId: id };
            const reaction = await reactionCollection.find(query).toArray();
            res.send(reaction);
        });

        //top react post data
        app.get("/reaction", async (req, res) => {
            const query = {};
            const result = await reactionCollection.find(query).toArray();
            res.send(result);
        });



    } finally {
    }
}


run().catch(e => console.error(e))

app.get('/', (req, res) => {
    res.send('social app server is running')
})

app.listen(port, () => {
    console.log(`social app server running ${port}`)
})