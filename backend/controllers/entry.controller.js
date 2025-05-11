const Entry = require("../models/entry.model");

const mongoose = require("mongoose");

exports.createEntry = async (req, res) => {
  try {
    const { category, type, paymentMethod, date, amount, description } =
      req.body;

    const newEntry = new Entry({
      userId: req.user.id,
      category,
      type,
      paymentMethod,
      date,
      amount,
      description,
    });

    const savedEntry = await newEntry.save();
    res.status(201).json({
      message: "Entry created successfully",
      success: true,
      entryData: savedEntry,
    });
  } catch (err) {
    res.status(401).json({ message: "Error saving entry", error: err.message });
  }
};

module.exports.getAllEntries = async (req, res) => {
  try {
    const userId = req.user.id;
    const entries = await Entry.find({ userId }).sort({ createdAt: -1 });
    res.status(201).json({ success: true, entries });
  } catch (error) {
    res.status(401).json({ message: "Error fetching entries", error });
  }
};

module.exports.deleteEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const entryId = req.params.id;

    const entry = await Entry.findById(entryId);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    if (entry.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this entry" });
    }

    await Entry.findByIdAndDelete(entryId);

    return res
      .status(200)
      .json({ success: true, message: "Entry deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};

module.exports.getMonthlyIncome = async (req, res) => {
  try {
    const userId = req.user.id;

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1); // May 1
    const end = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    ); // May 31

    const totalIncome = await Entry.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: "income",
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.status(201).json({
      success: true,
      totalIncome: totalIncome[0]?.total || 0,
    });
  } catch (error) {
    res.status(401).json({
      message: "Error calculating income",
      error,
    });
  }
};

module.exports.getMonthlyExpense = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get start (1st day of current month) and end (last day of current month)
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const totalExpense = await Entry.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: "expense",
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.status(201).json({
      success: true,
      totalExpense: totalExpense[0]?.total || 0,
    });
  } catch (error) {
    res.status(401).json({
      message: "Error calculating expense",
      error,
    });
  }
};

// Utility to get month name from number (0–11)
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

module.exports.getLastThreeMonthsSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // Previous 3 full months: start from 1st of (now - 3), end at end of (now - 1)
    const startDate = new Date(now.getFullYear(), now.getMonth() - 4, 1);
    const endDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999
    );

    const summary = await Entry.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 },
      },
    ]);

    const formatted = [];

    for (let i = 4; i >= 1; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const monthName = monthNames[month - 1];

      const monthData = summary.filter(
        (s) => s._id.month === month && s._id.year === year
      );

      const income = monthData.find((d) => d._id.type === "income")?.total || 0;
      const expense =
        monthData.find((d) => d._id.type === "expense")?.total || 0;

      formatted.push({
        month: monthName,
        income,
        expense,
      });
    }

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching summary",
      error,
    });
  }
};
