const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Income",
        "Loan",
        "Borrow",
        "Food",
        "Housing",
        "Education",
        "Medical",
        "Travel",
        "Others",
      ],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },
    date: { type: Date, required: true },
    amount: {
      type: Number,
      required: true,
    },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const Entry = mongoose.model("Entry", entrySchema);

module.exports = Entry;
