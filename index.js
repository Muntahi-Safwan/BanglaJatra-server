const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// Cors Options
const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.89qplrh.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const packageCollection = client
            .db("BanglaJatraDB")
            .collection("packages");
        const usersCollection = client.db("BanglaJatraDB").collection("users");
        const bookingCollection = client
            .db("BanglaJatraDB")
            .collection("bookings");

        // Get Packages
        app.get("/packages", async (req, res) => {
            const cursor = packageCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });
        // Get Users
        app.get("/users", async (req, res) => {
            const cursor = usersCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // Add a service into the Database
        app.post("/packages", async (req, res) => {
            const newPackage = req.body;
            // console.log(newProduct);
            const result = await packageCollection.insertOne(newPackage);
            res.send(result);
        });
        // Add a service into the Database
        app.post("/users", async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            res.send(result);
        });

        // Get Single Package Data from Database
        app.get("/package/:id", async (req, res) => {
            const id = req.params.id;
            const result = await packageCollection.findOne({
                _id: new ObjectId(id),
            });
            res.send(result);
        });

        // Book Pakcage into database
        app.post("/bookings", async (req, res) => {
            const bookPackage = req.body;
            // console.log(newProduct);
            const result = await bookingCollection.insertOne(bookPackage);
            res.send(result);
        });

        // My Packages from the Database based on USER
        app.get("/bookings", async (req, res) => {
            console.log(req.query.email);
            let query = {};
            if (req.query?.email) {
                query = { user_email: req.query.email };
            }
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        });

        // // Update Service Info
        // app.put("/service/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: new ObjectId(id) };
        //     const options = { upsert: true };
        //     const updatedService = req.body;
        //     console.log(updatedService);
        //     const service = {
        //         $set: {
        //             name: updatedService.name,
        //             user_name: updatedService.user_name,
        //             user_img: updatedService.user_img,
        //             serviceArea: updatedService.serviceArea,
        //             price: updatedService.price,
        //             short_description: updatedService.short_description,
        //             photo_url: updatedService.photo_url,
        //         },
        //     };

        //     const result = await bookingCollection.updateOne(
        //         filter,
        //         service,
        //         options
        //     );
        //     console.log(
        //         `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
        //     );
        //     res.send(result);
        // });

        // // Delete Service from the Database
        // app.delete("/service/:id", async (req, res) => {
        //     const id = req.params.id;
        //     console.log("Delete from server", id);
        //     const query = { _id: new ObjectId(id) };
        //     console.log(query);
        //     const result = await bookingCollection.deleteOne(query);
        //     console.log(result);
        //     res.send(result);
        // });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Server is Running");
});

app.listen(port, () => {
    console.log(`Server is running on port:  ${port}`);
});
