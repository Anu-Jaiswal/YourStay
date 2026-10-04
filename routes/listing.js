const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
  
   .get(wrapAsync(listingController.index))
   .post(
    isLoggedIn,

    (req, res, next) => {
        upload.single("listing[image]")(req, res, (err) => {
            if (err) {
                console.log("🔥 CLOUDINARY UPLOAD ERROR:");
                console.log(err);
                return next(err);
            }
            next();
        });
    },

    validateListing,
    wrapAsync(listingController.createListing),
)

     //New route
router.get("/new",isLoggedIn, listingController.renderNewForm);
 
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListings)
)
    .delete(
    isLoggedIn,
    isOwner, 
    wrapAsync(listingController.destroyListing)
);

//Edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
     wrapAsync(listingController.renderEditForm));
     
module.exports = router;








