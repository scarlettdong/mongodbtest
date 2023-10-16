const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost:27017/budgetDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Could not connect to MongoDB', error));

// Define a Mongoose schema and model
const budgetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true,
        match: /^#[0-9A-Fa-f]{6}$/,
        default: "#FF5733"
    }
});

const Budget = mongoose.model('Budget', budgetSchema);

app.use(express.json()); // To parse JSON requests

app.use('/', express.static('public'));

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

// Fetch data from MongoDB
app.get('/budget', async (req, res) => {
    try {
        const budgets = await Budget.find();
        res.json({ myBudget: budgets });
    } catch (error) {
        console.error("DB fetch error:", error);
        res.status(500).send('Server error');
    }
});

// Add new data to MongoDB
app.post('/budget', async (req, res) => {
    try {
        const budget = new Budget({
            title: req.body.title,
            budget: req.body.budget,
            color: req.body.color
        });
        await budget.save();
        res.status(201).send(budget);
    } catch (error) {
        console.error("DB save error:", error);
        res.status(500).send('Server error');
    }
});

app.listen(port, ()=>{
    console.log(`Example app listening at http://localhost:${port}`);
});
