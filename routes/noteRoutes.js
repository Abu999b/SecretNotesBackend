const express = require("express");
const Note = require("../models/Note");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Create note
router.post("/", auth, async (req, res) => {
  try {
    const newNote = new Note({ userId: req.user.id, content: req.body.content });
    await newNote.save();
    res.json(newNote);
  } catch (err) {
    res.status(500).json({ error: "Failed to create note" });
  }
});

// Get all notes
router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// Update note
router.put("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { content: req.body.content },
      { new: true }
    );
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Failed to update note" });
  }
});

// Delete note
router.delete("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

module.exports = router;
