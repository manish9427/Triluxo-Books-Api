const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

const mongoURI =
  "mongodb+srv://manish9427:manish9427@project.hwbxf7p.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoURI);

// MongoDB schema for Book
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
});

const Book = mongoose.model("Book", bookSchema);

app.use(bodyParser.json());

// Middleware to convert short ID to MongoDB ObjectID
const convertToObjectId = (req, res, next) => {
  const { id } = req.params;
  if (id.length === 24) {
    // Assume it's a valid MongoDB ObjectID
    req.params.id = mongoose.Types.ObjectId(id);
  }
  next();
};

// GET a specific book by ID (accepts short or long ID)
app.get("/books/:id", convertToObjectId, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT update an existing book (accepts short or long ID)
app.put("/books/:id", convertToObjectId, async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBook) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE a book (accepts short or long ID)
app.delete("/books/:id", convertToObjectId, async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
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
