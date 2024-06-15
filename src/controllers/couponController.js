import asyncHandler from "express-async-handler";
import db from "../index.js";

const createCoupon = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    couponCode,
    expiryDate,
    commission,
    discount,
    limit,
  } = req.body;

  // Perform validation checks here
  if (
    !name ||
    !email ||
    !phone ||
    !couponCode ||
    !expiryDate ||
    !commission ||
    !discount ||
    !limit
  ) {
    return res.status(400).json({
      status: "failed",
      message: "Missing required fields",
    });
  }

  const q1 = "SELECT * FROM coupon WHERE coupon_code=? AND email=?";
  db.query(q1, [couponCode, email], (err, data) => {
    if (err) {
      return res.status(400).json({
        status: "failed",
        message: "coupon code for this user already exists",
      });
    }
    const q2 =
      "INSERT INTO coupon (`name`,`email`,`phone`,`coupon_code`,`expiry_date`,`commission_amount`,`discounted_amount`,`coupon_code_limit`,`coupon_status`,`coupon_code_redeemed`) VALUES(?)";
    const values = [
      name,
      email,
      phone,
      couponCode,
      expiryDate,
      commission,
      discount,
      limit,
      'ACTIVE',
      0
    ];
    db.query(q2, [values], (err, data) => {
      if (err)
        return res.json({
          status: "failed",
          message: err,
        });
      return res.json({
        status: "success",
        message: "coupon code created",
      });
    });
  });
});

const editCoupon = asyncHandler(async (req, res) => {
  const updateData = req.body;
  await renameKey(updateData, "couponCode", "coupon_code");
  await renameKey(updateData, "expiryDate", "expiry_date");
  await renameKey(updateData, "commission", "commission_amount");
  await renameKey(updateData, "discount", "discounted_amount");
  await renameKey(updateData, "limit", "coupon_code_limit");
  const { id } = req.params;
  console.log(id, "id here");
  const q1 = "SELECT * FROM coupon WHERE id=?";
  db.query(q1, [id], (err, data) => {
    if (err) {
      return res.status(400).json({
        status: "failed",
        message: "Failed to fetch coupon",
      });
    }
    if (data.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "Coupon not found",
      });
    }
    let query = "UPDATE coupon SET";
    const values2 = [];
    Object.keys(updateData).forEach((key, index) => {
      query += ` ${key} = ?`;
      if (index < Object.keys(updateData).length - 1) {
        query += ",";
      }
      values2.push(updateData[key]);
    });
    query += " WHERE id = ?";
    values2.push(id);
    db.query(query, values2, (err, data) => {
      if (err) {
        console.log(err, "coupon failed");
        return res.status(500).json({
          status: "failed",
          message: "Failed to update coupon",
        });
      }
      return res.json({
        status: "success",
        message: "Coupon updated successfully",
      });
    });
  });
});

const showCoupons = asyncHandler(async (req, res) => {
  const q = "SELECT * FROM coupon";
  db.query(q, (err, data) => {
    if (err) {
      return res.json({
        status: "failed",
        message: err,
      });
    }
    return res.json(data);
  });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const q = "DELETE FROM coupon WHERE id = ?";
  db.query(q, [id], (err, data) => {
    if (err) {
      return res.status(500).json({
        status: "failed",
        message: "Failed to delete coupon",
      });
    }
    return res.json({
      status: "success",
      message: "Coupon deleted successfully",
    });
  });
});

export { createCoupon, showCoupons, editCoupon, deleteCoupon };

function renameKey(obj, oldKey, newKey) {
  if (oldKey in obj) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }
  return obj;
}
