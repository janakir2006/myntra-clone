const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Wishlist = require("../models/Wishlist");
const RecentlyViewed = require("../models/RecentlyViewed");


router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const limit = Number(req.query.limit || 10);
    const currentProductId = req.query.currentProductId;

    const recentViews = await RecentlyViewed.find({ userId })
      .sort({ viewedAt: -1 })
      .limit(50)
      .populate("productId", "category")
      .lean();

    const wishlistItems = await Wishlist.find({ userId })
      .populate("productId", "category")
      .lean();

    const excludedProductIds = new Set();

    const categoryScores = {};

    for (const view of recentViews) {
      if (view.productId?._id) {
        //excludedProductIds.add(view.productId._id.toString());

        const category = view.productId.category || "General";
        categoryScores[category] = (categoryScores[category] || 0) + 3;
      }
    }

    for (const wish of wishlistItems) {
      if (wish.productId?._id) {
        //excludedProductIds.add(wish.productId._id.toString());

        const category = wish.productId.category || "General";
        categoryScores[category] = (categoryScores[category] || 0) + 5;
      }
    }

    if (currentProductId) {
      excludedProductIds.add(currentProductId.toString());
    }

    const preferredCategories = Object.keys(categoryScores).sort(
      (a, b) => categoryScores[b] - categoryScores[a]
    );

    let recommendations = [];

    if (preferredCategories.length > 0) {
      recommendations = await Product.find({
        category: { $in: preferredCategories },
        isDiscontinued: false,
        _id: {
          $nin: Array.from(excludedProductIds),
        },
      })
        .sort({
          popularityScore: -1,
          viewCount: -1,
          createdAt: -1,
        })
        .limit(limit)
        .lean();
    }

    if (recommendations.length < limit) {
      const alreadyRecommendedIds = recommendations.map((p) =>
        p._id.toString()
      );

      const fallbackProducts = await Product.find({
        isDiscontinued: false,
        _id: {
          $nin: [
            ...Array.from(excludedProductIds),
            ...alreadyRecommendedIds,
          ],
        },
      })
        .sort({
          popularityScore: -1,
          viewCount: -1,
          createdAt: -1,
        })
        .limit(limit - recommendations.length)
        .lean();

      recommendations = [...recommendations, ...fallbackProducts];
    }

    res.status(200).json({
      source:
        preferredCategories.length > 0
          ? "personalized"
          : "popularity_fallback",
      preferredCategories,
      recommendations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to generate recommendations",
    });
  }
});

module.exports = router;