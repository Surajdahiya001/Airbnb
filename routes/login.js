const express = require("express");
router = express.Router();
const Model = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { Loggedin } = require("../middleware/middleware.js");
const ListingController = require("../controllers/login.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");

const upload = multer({storage});


//  INDEX ROUTE ---->

router.get("/", wrapAsync(ListingController.index));

// NEW ROUTE --->

router.get("/new",Loggedin,ListingController.new);

// CREATE ROUTE --->

router.post("/",Loggedin, upload.single("data[image]"), wrapAsync(ListingController.create));

// SHOW  ROUTE --->

router.get("/:id", wrapAsync(ListingController.show));

// UPDATE ROUTE ---> 

router.get("/:id/edit",Loggedin, wrapAsync(ListingController.update));

// EDIT ROUTE --->

router.put("/:id",upload.single("data[image]"), wrapAsync(ListingController.edit));

// DELETE ROUTE --->

router.delete("/:id",Loggedin, wrapAsync(ListingController.destory));



module.exports = router;