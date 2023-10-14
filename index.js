const express = require("express")
const app = express()
const db = require("./db/Connection")
const port = 5000
const bodyParser = require("body-parser")
const User = require("./models/UsersModal")
app.use(express.static("public"))
const cors = require("cors")
app.use(cors())
app.use(express.json());


app.use(bodyParser.urlencoded({extended:true}))

app.get('/', (req,res)=>{
    res.sendFile(__dirname + "/public/index.html")
})

app.post("/api/addData", async (req, res) => {
    try {
        const { name, email, age } = req.body;
        console.log(req.body)
        if (!name || !age) {
            // Check if name and age are provided
            return res.status(400).json({ error: "Name and age are required." });
        }

        // Create a new User document
        const newUser = new User({ name, email, age });
        
        // Save the new User document to the database
        await newUser.save();

        res.status(200).json({ message: "Data added successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error adding data." });
    }
});

app.get("/api/getData", async (req, res) => {
    try {
        const result = await User.find();
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error fetching data." });
    }
});

app.delete('/api/deleteRecord/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Use the User model to find and remove the record
        const result = await User.findByIdAndRemove(id);

        if (result) {
            res.status(200).json({ message: "Record deleted successfully" });
        } else {
            res.status(404).json({ error: "Record not found" });
        }
    } catch (error) {
        console.error("Error deleting record: " + error.message);
        res.status(500).json({ error: "Error deleting record" });
    }
});

// Update a record by ID
app.put('/api/updateRecord/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, age } = req.body;

        // Use the User model to find and update the record
        const updatedRecord = await User.findByIdAndUpdate(id, { name, email, age }, { new: true });

        if (updatedRecord) {
            res.status(200).json({ message: "Record updated successfully", updatedRecord });
        } else {
            res.status(404).json({ error: "Record not found" });
        }
    } catch (error) {
        console.error("Error updating record: " + error.message);
        res.status(500).json({ error: "Error updating record" });
    }
});

app.listen(port,()=>{
    console.log("Server running")
})