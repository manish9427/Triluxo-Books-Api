const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

const mongoURI =
  "mongodb+srv://manish9427:manish9427@project.hwbxf7p.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoURI);

// MongoDB schema for Book with a custom ID
const bookSchema = new mongoose.Schema({
  customId: { type: String, unique: true },
  title: String,
  author: String,
  genre: String,
});

const Book = mongoose.model("Book", bookSchema);

app.use(bodyParser.json());

// GET all books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET a specific book by custom ID
app.get("/books/:customId", async (req, res) => {
  try {
    const book = await Book.findOne({ customId: req.params.customId });
    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST a new book
app.post("/books", async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.json(savedBook);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT update an existing book by custom ID
app.put("/books/:customId", async (req, res) => {
  try {
    const updatedBook = await Book.findOneAndUpdate(
      { customId: req.params.customId },
      req.body,
      { new: true }
    );
    if (!updatedBook) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE a book by custom ID
app.delete("/books/:customId", async (req, res) => {
  try {
    const deletedBook = await Book.findOneAndDelete({
      customId: req.params.customId,
    });
    if (!deletedBook) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    res.json(deletedBook);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
