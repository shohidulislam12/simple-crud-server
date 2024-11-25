const express = require('express')
var cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port =process.env.PORT|| 3000
const app = express()
// username mdshohidulislam001
//password JjjAo9lzuYDhr87I
app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://mdshohidulislam001:JjjAo9lzuYDhr87I@cluster0.mq5kn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    const database = client.db("usersDB");
    const usercollection = database.collection("users");
app.get('/users',async(req,res)=>{
  const cursor = usercollection.find();
  const result=await cursor.toArray();
  res.send(result)
})
app.get('/users/:id',async(req,res)=>{
    const id=req.params.id;
    const query = { _id:new ObjectId(id) };
    const user=await usercollection.findOne(query)
   res.send(user)
})
app.post("/users",async(req,res)=>{
   const user=req.body
   console.log("newuser",user);
   const result = await usercollection.insertOne(user);
   res.send(result)
})
app.put('/users/:id',async(req,res)=>{
     const id=req.params.id;
     const user=req.body
     console.log('update user',user);
     const filter={_id:new ObjectId(id)}
     const options = { upsert: true };
     const updateduser={
      $set: {
        name:user.name,
        email:user.email
      },
     }
     const result=await usercollection.updateOne(filter,updateduser,options)
     res.send(result)
})
app.delete('/users/:id',async(req,res)=>{
  const id=req.params.id
  console.log("plese delet id from db",id);
  const query = { _id:new ObjectId(id) };
  const result=await usercollection.deleteOne(query)
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
  res.send('Simple Crud is running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})