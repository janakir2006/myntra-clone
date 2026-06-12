const express = require("express");
const mongoose = require("mongoose");
const Bag = require("../models/Bag");
const Product = require("../models/Product");

const router = express.Router();

router.post("/", async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { userId, productId, size, quantity = 1 } = req.body;

    const product = await Product.findById(productId).session(session);

    if (!product) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.isDiscontinued) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "This product is discontinued",
      });
    }

    if (product.stock !== undefined && product.stock < quantity) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient stock available",
      });
    }

    const existingItem = await Bag.findOne({
      userId,
      productId,
      size,
      itemType: "active",
    }).session(session);

    let savedItem;

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.version += 1;
      existingItem.lastKnownPrice = product.price;
      savedItem = await existingItem.save({ session });
    } else {
      savedItem = await Bag.create(
        [
          {
            userId,
            productId,
            size,
            quantity,
            itemType: "active",
            lastKnownPrice: product.price,
            version: 1,
          },
        ],
        { session }
      );

      savedItem = savedItem[0];
    }

    await session.commitTransaction();

    res.status(200).json(savedItem);
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  } finally {
    session.endSession();
  }
});

router.get("/:userid", async (req, res) => {
  try {
    const bag = await Bag.find({ userId: req.params.userid }).populate(
      "productId"
    );

    const activeItems = [];
    const savedItems = [];
    let activeTotal = 0;

    for (const item of bag) {
      const product = item.productId;

const enrichedItem = {
  ...item.toObject(),
  productMissing: !product,
  priceChanged: product ? item.lastKnownPrice !== product.price : false,
  discontinued: product ? product.isDiscontinued === true : true,
  currentPrice: product ? product.price : 0,
};

if (item.itemType === "saved") {
  savedItems.push(enrichedItem);
} else {
  activeItems.push(enrichedItem);

  if (product && !product.isDiscontinued) {
    activeTotal += product.price * item.quantity;
  }
}
    }

    res.status(200).json({
      activeItems,
      savedItems,
      activeTotal,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.patch("/:itemid/quantity", async (req, res) => {
  try {
    const { quantity, version } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const item = await Bag.findOne({
      _id: req.params.itemid,
      version,
    }).populate("productId");

    if (!item) {
      return res.status(409).json({
        message: "Cart item was updated from another device. Please refresh.",
      });
    }

    if (item.productId?.stock !== undefined && item.productId.stock < quantity) {
      return res.status(400).json({
        message: "Insufficient stock available",
      });
    }

    item.quantity = quantity;
    item.version += 1;

    const updatedItem = await item.save();

    res.status(200).json(updatedItem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating quantity" });
  }
});

router.patch("/:itemid/save-for-later", async (req, res) => {
  try {
    const item = await Bag.findById(req.params.itemid);

    if (!item) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    item.itemType = "saved";
    item.version += 1;

    await item.save();

    res.status(200).json({
      message: "Item moved to Save for Later",
      item,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error moving item to Save for Later",
    });
  }
});

router.patch("/:itemid/move-to-cart", async (req, res) => {
  try {
    const item = await Bag.findById(req.params.itemid).populate("productId");

    if (!item) {
      return res.status(404).json({
        message: "Saved item not found",
      });
    }

    if (item.productId?.isDiscontinued) {
      return res.status(400).json({
        message: "This product is discontinued",
      });
    }

    if (
      item.productId?.stock !== undefined &&
      item.productId.stock < item.quantity
    ) {
      return res.status(400).json({
        message: "Insufficient stock available",
      });
    }

    item.itemType = "active";
    item.lastKnownPrice = item.productId.price;
    item.version += 1;

    await item.save();

    res.status(200).json({
      message: "Item moved back to cart",
      item,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error moving item back to cart",
    });
  }
});

router.delete("/:itemid", async (req, res) => {
  try {
    await Bag.findByIdAndDelete(req.params.itemid);
    res.status(200).json({ message: "Item removed from bag" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error removing item from bag" });
  }
});

module.exports = router;