const express = require("express");
const router = express.Router();
const RecentlyViewed = require("../models/RecentlyViewed");

router.post("/", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        message: "userId and productId are required",
      });
    }

    await RecentlyViewed.findOneAndUpdate(
      { userId, productId },
      {
        viewedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
      }
    );

    // Keep only latest 50 unique views
    const extraItems = await RecentlyViewed.find({ userId })
      .sort({ viewedAt: -1 })
      .skip(50);

    if (extraItems.length > 0) {
      await RecentlyViewed.deleteMany({
        _id: {
          $in: extraItems.map((item) => item._id),
        },
      });
    }

    res.json({
      message: "Recently viewed updated successfully",
    });
  } catch (error) {
    console.log("Recently viewed error:", error);

    res.status(500).json({
      message: "Error updating recently viewed",
      error: error.message,
    });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const items = await RecentlyViewed.find({
      userId: req.params.userId,
    })
      .sort({ viewedAt: -1 })
      .limit(50)
      .populate("productId");

    res.json(items);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching recently viewed",
      error,
    });
  }
});

router.post("/merge", async (req, res) => {
  try {
    const { userId, localHistory } = req.body;

    if (!userId || !Array.isArray(localHistory)) {
      return res.status(400).json({
        message: "Invalid merge data",
      });
    }

    for (const item of localHistory) {
      await RecentlyViewed.findOneAndUpdate(
        {
          userId,
          productId: item.productId,
        },
        {
          viewedAt: item.viewedAt
            ? new Date(item.viewedAt)
            : new Date(),
        },
        {
          upsert: true,
          new: true,
        }
      );
    }

    // Keep only latest 50 unique views
    const extraItems = await RecentlyViewed.find({ userId })
      .sort({ viewedAt: -1 })
      .skip(50);

    if (extraItems.length > 0) {
      await RecentlyViewed.deleteMany({
        _id: {
          $in: extraItems.map((item) => item._id),
        },
      });
    }

    const mergedItems = await RecentlyViewed.find({ userId })
      .sort({ viewedAt: -1 })
      .limit(50)
      .populate("productId");

    res.json(mergedItems);
  } catch (error) {
    console.log("Merge recently viewed error:", error);

    res.status(500).json({
      message: "Error merging recently viewed",
      error: error.message,
    });
  }
});

module.exports = router;