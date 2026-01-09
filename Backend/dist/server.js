"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_express4 = __toESM(require("express"));
var import_cookie_parser = __toESM(require("cookie-parser"));
var import_cors = __toESM(require("cors"));
var import_mongoose5 = __toESM(require("mongoose"));
var import_dotenv = __toESM(require("dotenv"));
var import_path = __toESM(require("path"));

// src/routes/auth.ts
var import_express = require("express");
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));

// src/middlewares/Auth.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var cookieOptions = {
  httpOnly: true,
  secure: true,
  // Always true since we're using HTTPS (GitHub Pages to localhost requires this)
  sameSite: "none",
  // Required for cross-origin cookies
  path: "/"
};
function verifyToken(token) {
  return import_jsonwebtoken.default.verify(token, process.env.JWT_SECRET);
}
function requireAuth(req, res, next) {
  const access = req.cookies?.accessToken;
  const refresh = req.cookies?.refreshToken;
  if (access) {
    try {
      req.user = verifyToken(access);
      return next();
    } catch {
    }
  }
  if (!refresh) {
    return res.status(401).json({ message: "No token" });
  }
  try {
    const payload = verifyToken(refresh);
    const newAccess = import_jsonwebtoken.default.sign(
      { id: payload.id, email: payload.email },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );
    res.cookie("accessToken", newAccess, cookieOptions);
    req.user = { id: payload.id, email: payload.email, name: payload.name };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// src/models/schemas/userSchema.ts
var import_mongoose = require("mongoose");
var userSchema = new import_mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);
var User = (0, import_mongoose.model)("User", userSchema);

// src/routes/auth.ts
var import_bcryptjs2 = __toESM(require("bcryptjs"));

// src/controllers/authController.ts
var import_bcryptjs = __toESM(require("bcryptjs"));
var updateMe = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const { name, email, password } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (typeof name === "string" && name.trim()) {
      user.name = name.trim();
    }
    if (typeof email === "string" && email.trim()) {
      user.email = email.trim();
    }
    if (typeof password === "string" && password.trim()) {
      const hashed = await import_bcryptjs.default.hash(password.trim(), 10);
      user.passwordHash = hashed;
    }
    await user.save();
  } catch (error) {
    console.error("[updatedMe] Error:", error);
    return res.status(500).json({ message: "Failed to update user" });
  }
};

// src/routes/auth.ts
var router = (0, import_express.Router)();
function makeAccessToken(user) {
  return import_jsonwebtoken2.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "10m" });
}
function makeRefreshToken(user) {
  return import_jsonwebtoken2.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
}
var isProd = process.env.NODE_ENV === "production";
var cookieOptions2 = {
  httpOnly: true,
  secure: true,
  // Always true since we're using HTTPS (GitHub Pages to localhost requires this)
  sameSite: "none",
  // Required for cross-origin cookies
  path: "/"
};
router.use((req, res, next) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0"
  });
  next();
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }
  try {
    const userDoc = await User.findOne({ email: email.toLowerCase() }).exec();
    if (!userDoc) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const passwordMatches = await import_bcryptjs2.default.compare(password, userDoc.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const payload = { id: userDoc._id.toString(), email: userDoc.email };
    const access = makeAccessToken(payload);
    const refresh = makeRefreshToken(payload);
    console.log("Login attempt:", email);
    res.cookie("accessToken", access, cookieOptions2);
    res.cookie("refreshToken", refresh, cookieOptions2);
    const user = {
      id: userDoc._id.toString(),
      email: userDoc.email,
      name: userDoc.name
    };
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password required" });
    }
    const existing = await User.findOne({ email: email.toLowerCase() }).exec();
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }
    const passwordHash = await import_bcryptjs2.default.hash(password, 10);
    const userDoc = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash
    });
    const payload = { id: userDoc._id.toString(), email: userDoc.email };
    const accessToken = makeAccessToken(payload);
    const refreshToken = makeRefreshToken(payload);
    res.cookie("accessToken", accessToken, cookieOptions2);
    res.cookie("refreshToken", refreshToken, cookieOptions2);
    const user = {
      id: userDoc._id.toString(),
      email: userDoc.email,
      name: userDoc.name
    };
    return res.status(201).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/refresh", (req, res) => {
  const rt = req.cookies?.refreshToken;
  if (!rt) return res.status(401).json({ message: "No refresh token" });
  try {
    const payload = import_jsonwebtoken2.default.verify(rt, process.env.JWT_SECRET);
    const newAccess = makeAccessToken(payload);
    const newRefresh = makeRefreshToken(payload);
    res.cookie("accessToken", newAccess, cookieOptions2);
    res.cookie("refreshToken", newRefresh, cookieOptions2);
    return res.json({ ok: true });
  } catch {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const userDoc = await User.findById(user.id).exec();
    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({
      id: userDoc._id.toString(),
      email: userDoc.email,
      name: userDoc.name
    });
  } catch (err) {
    console.error("[/me] Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.put("/me", requireAuth, updateMe);
router.post("/logout", (_req, res) => {
  res.clearCookie(
    "accessToken",
    {
      path: "/",
      sameSite: cookieOptions2.sameSite,
      secure: cookieOptions2.secure
    }
  );
  res.clearCookie(
    "refreshToken",
    {
      path: "/",
      sameSite: cookieOptions2.sameSite,
      secure: cookieOptions2.secure
    }
  );
  res.json({ ok: true });
});
router.post("/saveSize", requireAuth, async (req, res) => {
  const user = req.user;
  const { sizeProfile } = req.body;
  console.log("[saveSize] for user", user.email, "data:", sizeProfile);
  return res.json({
    ok: true,
    message: "Size profile saved (stub).",
    sizeProfile: sizeProfile ?? null
  });
});
var auth_default = router;

// src/routes/Order.ts
var import_express2 = __toESM(require("express"));
var import_mongoose4 = __toESM(require("mongoose"));
var import_crypto2 = __toESM(require("crypto"));

// src/models/objects/products.ts
var othClass = "othBlue";
var ocClass = "ocBeige";
var skamClass = "skamYellow";
var yrClass = "yrPurple";
var products = [
  {
    id: "91c20ef0-cf61-4ee1-a746-1ea1d6384244",
    label: "One Tree Hill Hoodie",
    fandom: "One Tree Hill",
    images: {
      white: "/static/Merch/oth-hoodie-vit.png",
      grey: "/static/Merch/oth-hoodie-gr\xE5.png",
      black: "/static/Merch/oth-hoodie-svart.png"
    },
    availableColor: [],
    price: 20,
    path: "/:id",
    description: "This hoodie is made from a soft cotton and polyester blend that combines comfort, warmth, and durability. The brushed interior gives it a cozy feel, perfect for everyday wear or lounging.",
    model: "Unisex",
    class: othClass,
    washing: {
      temp: 30,
      similarColors: true,
      canBleach: false,
      dry: "Tumble dry or hang dry",
      iron: "Iron on low heat if needed (avoid print)",
      dryClean: false
    }
  },
  {
    id: "986a3e78-91c8-47b3-b5aa-fda66a776268",
    label: "The O.C Hoodie",
    fandom: "The O.C",
    images: {
      white: "/static/Merch/oc-hoodie-vit.png",
      grey: "/static/Merch/oc-hoodie-gr\xE5.png",
      black: "/static/Merch/oc-hoodie-svart.png"
    },
    availableColor: ["white", "grey", "black"],
    price: 20,
    path: "/The_OC_Hoodie",
    description: "This hoodie is made from a soft cotton and polyester blend that combines comfort, warmth, and durability. The brushed interior gives it a cozy feel, perfect for everyday wear or lounging.",
    model: "Unisex",
    class: ocClass,
    washing: {
      temp: 30,
      similarColors: true,
      canBleach: false,
      dry: "Tumble dry or hang dry",
      iron: "Iron on low heat if needed (avoid print)",
      dryClean: false
    }
  },
  {
    id: "d85407bf-400e-406f-bd13-26cc5fbf6e79",
    label: "Skam Hoodie",
    fandom: "Skam",
    images: {
      white: "/static/Merch/skam-hoodie-vit.png",
      grey: "/static/Merch/skam-hoodie-gr\xE5.png",
      black: "/static/Merch/skam-hoodie-svart.png"
    },
    availableColor: ["white", "grey", "black"],
    price: 20,
    path: "/Skam_Hoodie",
    description: "This hoodie is made from a soft cotton and polyester blend that combines comfort, warmth, and durability. The brushed interior gives it a cozy feel, perfect for everyday wear or lounging.",
    model: "Unisex",
    class: skamClass,
    washing: {
      temp: 30,
      similarColors: true,
      canBleach: false,
      dry: "Tumble dry or hang dry",
      iron: "Iron on low heat if needed (avoid print)",
      dryClean: false
    }
  },
  {
    id: "1adaaa10-c02b-493d-a7ce-027801551d40",
    label: "Young Royals Hoodie",
    fandom: "Young Royals",
    images: {
      white: "/static/Merch/yr-hoodie-vit.png",
      grey: "/static/Merch/yr-hoodie-gr\xE5.png",
      black: "/static/Merch/yr-hoodie-svart.png"
    },
    availableColor: ["white", "grey", "black"],
    price: 20,
    path: "/Young_Royals_Hoodie",
    description: "This hoodie is made from a soft cotton and polyester blend that combines comfort, warmth, and durability. The brushed interior gives it a cozy feel, perfect for everyday wear or lounging.",
    model: "Unisex",
    class: yrClass,
    washing: {
      temp: 30,
      similarColors: true,
      canBleach: false,
      dry: "Tumble dry or hang dry",
      iron: "Iron on low heat if needed (avoid print)",
      dryClean: false
    }
  },
  {
    id: "ded21a6c-ada4-4b1e-98c8-ce80f77638e4",
    label: "One Tree Hill Sweatshirt",
    fandom: "One Tree Hill",
    images: {
      white: "/static/Merch/oth-sweatshirt-vit.png",
      grey: "/static/Merch/oth-sweatshirt-gr\xE5.png",
      black: "/static/Merch/oth-sweatshirt-svart.png"
    },
    availableColor: ["white", "grey", "black"],
    price: 20,
    path: "OTH_Sweatshirt",
    description: "This sweatshirt is made from a soft cotton and polyester blend that combines comfort, warmth, and durability. The brushed interior gives it a cozy feel, perfect for everyday wear or lounging.",
    model: "Unisex",
    class: othClass,
    washing: {
      temp: 30,
      similarColors: true,
      canBleach: false,
      dry: "Tumble dry or hang dry",
      iron: "Iron on low heat if needed (avoid print)",
      dryClean: false
    }
  },
  {
    id: "f2a0d44e-0de7-4272-803d-8037509eb87c",
    label: "The O.C Sweatshirt",
    fandom: "The O.C",
    images: {
      white: "/static/Merch/oc-sweatshirt-vit.png",
      grey: "/static/Merch/oc-sweatshirt-gr\xE5.png",
      black: "/static/Merch/oc-sweatshirt-svart.png"
    },
    availableColor: ["white", "grey", "black"],
    price: 20,
    path: "OC_Sweatshirt",
    description: "This sweatshirt is made from a soft cotton and polyester blend that combines comfort, warmth, and durability. The brushed interior gives it a cozy feel, perfect for everyday wear or lounging.",
    model: "Unisex",
    class: ocClass,
    washing: {
      temp: 30,
      similarColors: true,
      canBleach: false,
      dry: "Tumble dry or hang dry",
      iron: "Iron on low heat if needed (avoid print)",
      dryClean: false
    }
  },
  {
    id: "bb010be2-899c-419e-a649-49dd441c9723",
    label: "Skam Sweatshirt",
    fandom: "Skam",
    images: {
      white: "/static/Merch/skam-sweatshirt-vit.png",
      grey: "/static/Merch/skam-sweatshirt-gr\xE5.png",
      black: "/static/Merch/skam-sweatshirt-svart.png"
    },
    availableColor: ["white", "grey", "black"],
    price: 20,
    path: "Skam_Sweatshirt",
    description: "This sweatshirt is made from a soft cotton and polyester blend that combines comfort, warmth, and durability. The brushed interior gives it a cozy feel, perfect for everyday wear or lounging.",
    model: "Unisex",
    class: skamClass,
    washing: {
      temp: 30,
      similarColors: true,
      canBleach: false,
      dry: "Tumble dry or hang dry",
      iron: "Iron on low heat if needed (avoid print)",
      dryClean: false
    }
  },
  {
    id: "a4d84529-a4fc-44aa-ae52-0e04e8f7d78f",
    label: "Young Royals Sweatshirt",
    fandom: "Young Royals",
    images: {
      white: "/static/Merch/yr-sweatshirt-vit.png",
      grey: "/static/Merch/yr-sweatshirt-gr\xE5.png",
      black: "/static/Merch/yr-sweatshirt-svart.png"
    },
    availableColor: ["white", "grey", "black"],
    price: 20,
    path: "Young_Royals_Sweatshirt",
    description: "This sweatshirt is made from a soft cotton and polyester blend that combines comfort, warmth, and durability. The brushed interior gives it a cozy feel, perfect for everyday wear or lounging.",
    model: "Unisex",
    class: yrClass,
    washing: {
      temp: 30,
      similarColors: true,
      canBleach: false,
      dry: "Tumble dry or hang dry",
      iron: "Iron on low heat if needed (avoid print)",
      dryClean: false
    }
  },
  {
    id: "78657548-29e1-43b3-976e-d5b3fa24f276",
    label: "One Tree Hill Women's Tshirt ",
    fandom: "One Tree Hill",
    images: {
      white: "/static/Merch/oth-tshirt-dam-vit.png",
      grey: "/static/Merch/oth-tshirt-dam-gr\xE5.png",
      black: "/static/Merch/oth-tshirt-dam-svart.png"
    },
    availableColor: ["white", "grey", "black"],
    price: 15,
    path: "/OTH_Women's_Tshirt",
    description: "This T-shirt is made from 100% premium cotton for a soft and breathable feel. The fabric ensures lasting comfort and durability, making it perfect for everyday wear.",
    model: "Women",
    class: othClass,
    washing: {
      temp: 30,
      similarColors: true,
      canBleach: false,
      dry: "Tuble dry low or hang to dry",
      iron: "Iron on low heat if needed (avoid print)",
      dryClean: false
    }
  },
  {
    id: "e970ae69-57da-4afa-a61b-312d450748be",
    label: "The O.C Women's Tshirt",
    fandom: "The O.C",
    images: {
      white: "/static/Merch/oc-tshirt-dam-vit.png",
      grey: "/static/Merch/oc-tshirt-dam-gr\xE5.png",
      black: "/static/Merch/oc-tshirt-dam-svart.png"
    },
    availableColor: ["white", "grey", "black"],
    price: 15,
    path: "/The_OC_Women's_Tshirt",
    description: "This T-shirt is made from 100% premium cotton for a soft and breathable feel. The fabric ensures lasting comfort and durability, making it perfect for everyday wear.",
    model: "Women",
    class: ocClass,
    washing: {
      temp: 30,
      similarColors: true,
      canBleach: false,
      dry: "Tuble dry low or hang to dry",
      iron: "Iron on low heat if needed (avoid print)",
      dryClean: false
    }
  },
  {
    id: "f97a9dec-7aca-4a79-85d3-0901752eb7a4",
    label: "Skam Women's Tshirt",
    fandom: "Skam",
    images: {
      white: "/static/Merch/skam-tshirt-dam-vit.png",
      grey: "/static/Merch/skam-tshirt-dam-gr\xE5.png",
      black: "/static/Merch/skam-tshirt-dam-svart.png"
    },
    availableColor: ["white", "grey", "black"],
    price: 15,
    path: "/Skam_Women's_Tshirt",
    description: "This T-shirt is made from 100% premium cotton for a soft and breathable feel. The fabric ensures lasting comfort and durability, making it perfect for everyday wear.",
    model: "Women",
    class: skamClass,
    washing: {
      temp: 30,
      canBleach: false,
      similarColors: true,
      dry: "Tuble dry low or hang to dry",
      iron: "Iron on low heat if needed (avoid print)",
      dryClean: false
    }
  },
  {
    id: "0997addd-d7b1-4b47-bd5c-c740b33270ac",
    label: "Young Royals Women's Tshirt",
    fandom: "Young Royals",
    images: {
      white: "/static/Merch/yr-tshirt-dam-vit.png",
      grey: "/static/Merch/yr-tshirt-dam-gr\xE5.png",
      black: "/static/Merch/yr-tshirt-dam-svart.png"
    },
    availableColor: ["white", "grey", "black"],
    price: 15,
    path: "/Young_Royals_Women's_Tshirt",
    description: "This T-shirt is made from 100% premium cotton for a soft and breathable feel. The fabric ensures lasting comfort and durability, making it perfect for everyday wear.",
    model: "Women",
    class: yrClass,
    washing: {
      temp: 30,
      canBleach: false,
      similarColors: true,
      dry: "Tuble dry low or hang to dry",
      iron: "Iron on low heat if needed (avoid print)",
      dryClean: false
    }
  },
  {
    id: "a49a5a2b-8175-4858-a878-2dd86d4ac245",
    label: "One Tree Hill Men's Tshirt ",
    fandom: "One Tree Hill",
    images: {
      white: "/static/Merch/oth-tshirt-herr-vit.png",
      grey: "/static/Merch/oth-tshirt-herr-gr\xE5.png",
      black: "/static/Merch/oth-tshirt-herr-svart.png"
    },
    availableColor: ["white", "grey", "black"],
    price: 15,
    path: "/OTH_Men's_Tshirt",
    description: "This T-shirt is made from 100% premium cotton for a soft and breathable feel. The fabric ensures lasting comfort and durability, making it perfect for everyday wear.",
    model: "Man",
    class: othClass,
    washing: {
      temp: 30,
      similarColors: true,
      canBleach: false,
      dry: "Tuble dry low or hang to dry",
      iron: "Iron on low heat if needed (avoid print)",
      dryClean: false
    }
  },
  {
    id: "5ba86ff2-b5dc-406d-9e8c-6863b9d1c97c",
    label: "The O.C Men's Tshirt",
    fandom: "The O.C",
    images: {
      white: "/static/Merch/oc-tshirt-herr-vit.png",
      grey: "/static/Merch/oc-tshirt-herr-gr\xE5.png",
      black: "/static/Merch/oc-tshirt-herr-svart.png"
    },
    availableColor: ["white", "grey", "black"],
    price: 15,
    path: "/The_OC_Men's_Tshirt",
    description: "This T-shirt is made from 100% premium cotton for a soft and breathable feel. The fabric ensures lasting comfort and durability, making it perfect for everyday wear.",
    model: "Man",
    class: ocClass,
    washing: {
      temp: 30,
      similarColors: true,
      canBleach: false,
      dry: "Tuble dry low or hang to dry",
      iron: "Iron on low heat if needed (avoid print)",
      dryClean: false
    }
  },
  {
    id: "2167001b-26af-4893-ade6-c418ca5eb981",
    label: "Skam Men's Tshirt",
    fandom: "Skam",
    images: {
      white: "/static/Merch/skan-tshirt-herr-vit.png",
      grey: "/static/Merch/oth-tshirt-herr-gr\xE5.png",
      black: "/static/Merch/oth-tshirt-herr-svart.png"
    },
    availableColor: ["white", "grey", "black"],
    price: 15,
    path: "/Skam_Men's_Tshirt",
    description: "This T-shirt is made from 100% premium cotton for a soft and breathable feel. The fabric ensures lasting comfort and durability, making it perfect for everyday wear.",
    model: "Man",
    class: skamClass,
    washing: {
      temp: 30,
      canBleach: false,
      similarColors: true,
      dry: "Tuble dry low or hang to dry",
      iron: "Iron on low heat if needed (avoid print)",
      dryClean: false
    }
  },
  {
    id: "bd91efdf-acc4-40db-af4e-9209b95eaacf",
    label: "Young Royals Men's Tshirt",
    fandom: "Young Royals",
    images: {
      white: "/static/Merch/yr-tshirt-herr-vit.png",
      grey: "/static/Merch/yr-tshirt-herr-gr\xE5.png",
      black: "/static/Merch/yr-tshirt-herr-svart.png"
    },
    availableColor: ["white", "grey", "black"],
    price: 15,
    path: "/Young_Royals_Men's_Tshirt",
    description: "This T-shirt is made from 100% premium cotton for a soft and breathable feel. The fabric ensures lasting comfort and durability, making it perfect for everyday wear.",
    model: "Man",
    class: yrClass,
    washing: {
      temp: 30,
      canBleach: false,
      similarColors: true,
      dry: "Tuble dry low or hang to dry",
      iron: "Iron on low heat if needed (avoid print)",
      dryClean: false
    }
  }
];

// src/models/schemas/orderSchema.ts
var import_mongoose3 = __toESM(require("mongoose"));

// src/models/schemas/AddressSchema.ts
var import_mongoose2 = require("mongoose");
var AddressSchema = new import_mongoose2.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    secondAddress: { type: String },
    zip: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true }
  },
  { _id: false }
);

// src/models/schemas/orderSchema.ts
var OrderItemSchema = new import_mongoose3.Schema(
  {
    productId: { type: String, required: true },
    productNameSnapshot: { type: String, required: true },
    unitPriceSnapshot: { type: Number, required: true },
    imageUrlSnapshot: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    color: { type: String },
    size: { type: String }
    // eller Number – men då måste frontend skicka Number
  },
  { _id: false }
);
var OrderSchema = new import_mongoose3.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: import_mongoose3.Schema.Types.ObjectId, ref: "User" },
    email: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    total: { type: Number, required: true },
    currency: { type: String, default: "EURO" },
    shippingMethodId: { type: String },
    paymentMethod: {
      type: String,
      enum: ["CARD", "KLARNA", "PAYPAL", "SWISH"],
      required: true
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "CANCELLED", "SHIPPED"],
      default: "PENDING"
    },
    paymentStatus: {
      type: String,
      enum: ["UNPAID", "AUTHORIZED", "PAID", "REFUNDED"],
      default: "UNPAID"
    },
    address: { type: AddressSchema, required: true },
    paymentRef: { type: String },
    guestTokenHash: {
      type: String
    }
  },
  { timestamps: true }
);
var OrderModel = import_mongoose3.default.model("Order", OrderSchema);

// src/middlewares/authOptional.ts
var import_jsonwebtoken3 = __toESM(require("jsonwebtoken"));
function verifyToken2(token) {
  return import_jsonwebtoken3.default.verify(token, process.env.JWT_SECRET);
}
function authOptional(req, _res, next) {
  const access = req.cookies?.accessToken;
  if (access) {
    try {
      req.user = verifyToken2(access);
    } catch {
    }
  }
  next();
}

// src/middlewares/makeOrdeId.ts
var import_crypto = __toESM(require("crypto"));
var makeOrderId = () => {
  const code = import_crypto.default.randomBytes(5).toString("hex").slice(0, 8).toUpperCase();
  return `CC-${code}`;
};

// src/middlewares/createUniqueOrderId.ts
var createUniqueOrderId = async (payload, session) => {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await OrderModel.create([payload], { session });
    } catch (err) {
      if (err?.code === 11e3 && err?.keyPattern?.orderNumber) {
        payload.orderNumber = makeOrderId();
        continue;
      }
      throw err;
    }
  }
  throw new Error("Couldn't generate a unique order number.");
};

// src/middlewares/initialPaymentStatus.ts
function initialPaymentStatus(method) {
  switch (method) {
    case "CARD":
    case "SWISH":
    case "PAYPAL":
    case "KLARNA":
      return "PAID";
    default:
      return "PENDING";
  }
}

// src/routes/Order.ts
var router2 = import_express2.default.Router();
var makeToken = () => import_crypto2.default.randomBytes(24).toString("hex");
var hashToken = (t) => import_crypto2.default.createHash("sha256").update(t).digest("hex");
router2.use(authOptional);
router2.post("/orders", async (req, res) => {
  const session = await import_mongoose4.default.startSession();
  try {
    const userId = req.user?.id;
    const {
      email,
      items,
      shippingFee,
      paymentMethod,
      address,
      shippingMethodId
    } = req.body;
    console.log("[POST /orders] req.user?.id =", userId);
    if (!email || !items?.length) {
      return res.status(400).json({ message: "email och items kr\xE4vs" });
    }
    const productMap = new Map(products.map((p) => [p.id, p]));
    let subtotal = 0;
    for (const i of items) {
      const p = productMap.get(i.productId);
      if (!p) {
        return res.status(400).json({ message: `Ogiltigt productId: ${i.productId}` });
      }
      if (!Number.isInteger(i.qty) || i.qty < 1) {
        return res.status(400).json({ message: `Ogiltig qty f\xF6r ${i.productId}` });
      }
      subtotal += (p.price ?? 0) * i.qty;
    }
    const total = subtotal + (shippingFee ?? 0);
    const orderItems = items.map((i) => {
      const p = products.find((x) => String(x.id) === String(i.productId));
      if (!p) throw new Error(`Product not found ${i.productId}`);
      const isColor = (v) => v === "black" || v === "white" || v === "grey";
      const raw = (i.color ?? "").toLowerCase();
      const colorKey = isColor(raw) ? raw : void 0;
      const imageUrlSnapshot = (colorKey ? p.images?.[colorKey] : void 0) || p.images?.black || p.images?.white || p.images?.grey || "";
      return {
        productId: i.productId,
        productNameSnapshot: p.label,
        unitPriceSnapshot: p.price ?? 0,
        qty: i.qty,
        color: i.color,
        size: i.size,
        imageUrlSnapshot
      };
    });
    console.log("ORDERITEMS[0] about to save:", orderItems[0]);
    console.log("imageUrlSnapshot value:", orderItems[0]?.imageUrlSnapshot);
    const guestToken = userId ? null : makeToken();
    const guestTokenHash = guestToken ? hashToken(guestToken) : void 0;
    let createdOrder;
    const paymentStatus = initialPaymentStatus(paymentMethod);
    await session.withTransaction(async () => {
      const payload = {
        orderNumber: makeOrderId(),
        userId: userId ?? null,
        guestTokenHash,
        email,
        items: orderItems,
        subtotal,
        shippingFee: shippingFee ?? 0,
        total,
        currency: "EUR",
        paymentMethod,
        status: "PENDING",
        paymentStatus,
        // ✅ här
        address,
        shippingMethodId
      };
      createdOrder = await createUniqueOrderId(payload, session);
    });
    const order = Array.isArray(createdOrder) ? createdOrder[0] : createdOrder;
    return res.status(201).json({
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      currency: order.currency,
      userId: userId ?? null,
      // ✅ returnera guestToken bara om det är en gästorder
      guestToken: guestToken ?? void 0
    });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    if (err?.name === "ValidationError" || err?.name === "CastError") {
      return res.status(400).json({
        name: err.name,
        message: err.message,
        errors: err.errors,
        value: err.value,
        path: err.path
      });
    }
    return res.status(500).json({
      message: "Couldn't create order",
      error: err?.message ?? String(err)
    });
  } finally {
    session.endSession();
  }
});
router2.get("/orders/me", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const orders = await OrderModel.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
  console.log("DB first item:", orders?.[0]?.items?.[0]);
  res.json(orders);
});
router2.get("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findById(id).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });
    const authedUserId = req.user?.id;
    if (order.userId && authedUserId && String(order.userId) === String(authedUserId)) {
      return res.json(order);
    }
    const guestToken = req.header("x-guest-token");
    if (order.guestTokenHash && guestToken) {
      const incomingHash = hashToken(guestToken);
      if (incomingHash === order.guestTokenHash) {
        return res.json(order);
      }
    }
    console.log("[GET /orders/:id] Forbidden", {
      authedUserId,
      orderUserId: order.userId ? String(order.userId) : null,
      hasGuestTokenHeader: Boolean(guestToken),
      hasGuestTokenHashOnOrder: Boolean(order.guestTokenHash)
    });
    return res.status(403).json({ message: "Forbidden" });
  } catch (error) {
    console.error("GET ORDER ERROR:", error);
    return res.status(500).json({ message: "Couldn't get order" });
  }
});
var Order_default = router2;

// src/routes/search.ts
var import_express3 = require("express");
var searchRouter = (0, import_express3.Router)();
var norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
searchRouter.get("/", (req, res) => {
  const q = String(req.query.query ?? "").trim();
  const limit = Math.min(Number(req.query.limit ?? 8), 50);
  if (!q) return res.status(200).json([]);
  const nq = norm(q);
  const hits = products.filter((p) => {
    const hay = norm(
      [p.label, p.fandom, p.description].filter(Boolean).join(" ")
    );
    return hay.includes(nq);
  }).slice(0, limit);
  return res.status(200).json(hits);
});

// src/server.ts
import_dotenv.default.config();
var app = (0, import_express4.default)();
app.set("trust proxy", 1);
var allowedOrigins = (process.env.CLIENT_ORIGINS ?? "http://localhost:5173,http://localhost:4000,https://annie03o.github.io").split(",").map((s) => s.trim()).filter(Boolean);
app.use(
  (0, import_cors.default)({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true
  })
);
app.use((0, import_cookie_parser.default)());
app.use(import_express4.default.json());
app.use((req, _res, next) => {
  console.log("[REQ]", req.method, req.url, "origin:", req.headers.origin);
  next();
});
app.use((req, _res, next) => {
  const token = req.cookies?.accessToken;
  if (token) {
    try {
      const payload = verifyToken2(token);
      req.user = { id: payload.id, email: payload.email, name: payload.name };
    } catch {
    }
  }
  next();
});
app.get("/health", (_req, res) => res.status(200).send("ok-clearchoice"));
app.use("/api/auth", auth_default);
app.use("/api/search", searchRouter);
app.use("/api", Order_default);
app.use("/static", import_express4.default.static(import_path.default.join(process.cwd(), "src/Merch")));
app.use((_req, res) => res.status(404).json({ error: "Not found" }));
var PORT = Number(process.env.PORT) || 4e3;
import_mongoose5.default.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}).catch((err) => {
  console.error("MongoDB error", err);
  process.exit(1);
});
