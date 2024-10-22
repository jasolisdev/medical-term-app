const mongoose = require("mongoose");

const FlashcardSchema = new mongoose.Schema({
  term: {
    type: String,
    required: true,
  },
  definition: {
    type: String,
    required: true,
  },
  pronunciation: String,
  audioFile: String,
  category: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Flashcard", FlashcardSchema);
