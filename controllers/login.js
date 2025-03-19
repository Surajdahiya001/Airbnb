const Model = require("../models/listing.js");


// INDEX ROUTE ---->

module.exports.index = async (req, res) => {

    let search = req.query.search || "";
  let category = req.query.category || "";
  let alldatas = [];
  if (category != "") {
    alldatas = await Model.find({ category: `${category}` });
  } else if (search !== "") {
    // allListings = await Listing.find({ title: { $regex: `\\b${search}`, $options: 'i' } }).populate("owner");
    // allListings = await Listing.find({
    //     $or: [
    //       { title: { $regex: `\\b${search}`, $options: 'i' } },
    //       { location: { $regex: `\\b${search}`, $options: 'i' } },
    //       { country: { $regex: `\\b${search}`, $options: 'i' } },
    //       { 'owner.username': { $regex: `\\b${search}`, $options: 'i' } }
    //     ]
    //   }).populate("owner").populate("reviews");
    alldatas = await Model.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $match: {
          $or: [
            { title: { $regex: `\\b${search}`, $options: "i" } },
            { location: { $regex: `\\b${search}`, $options: "i" } },
            { country: { $regex: `\\b${search}`, $options: "i" } },
            { "result.username": { $regex: `\\b${search}`, $options: "i" } },
            { category: { $regex: `\\b${search}`, $options: "i" } },
          ],
        },
      },
    ]);
    if (alldatas.length === 0) {
      throw new ExpressErr(404, "No match found");
    }
  } else {
    alldatas = await Model.find({});
  }

    // const alldatas = await Model.find({});
    res.render("listing.ejs", { alldatas });

    // const alldatas = await Model.find({});
    // res.render("listing.ejs", { alldatas });
}

// NEW ROUTE ---->

module.exports.new =  (req, res) => {

    res.render("form.ejs");
}

// CREATE ROUTE --->

module.exports.create = async (req, res) => {

    let url = req.file.path;
    let filename = req.file.filename;
    
    let alldata = new Model(req.body.data);
    alldata.owner = req.user._id;
    alldata.image = { url, filename };
    await alldata.save();
    req.flash("success", "Thanks for creating new Palace !");
    res.redirect("/login");

}

// SHOW ROUTES --->

module.exports.show = async (req, res) => {

    const { id } = req.params;
    const data = await Model.findById(id).populate({ path: "review", populate: { path: "auther", }, }).populate("owner");
    if (!data) {
        req.flash("error", "Oops.. Not Found !");
        res.redirect("/login");
    }
    res.render("show.ejs", { data });
}

//  UPDATE ROUTES --->

module.exports.update = async (req, res) => {

    const { id } = req.params;
    const data = await Model.findById(id);
    res.render("edit.ejs", { data });
}

// EDIT ROUTES --->

module.exports.edit = async (req, res) => {

    const { id } = req.params;
    let Listing = await Model.findByIdAndUpdate(id, { ...req.body.data })

    if(typeof  req.file !== "undefined"){

        let url = req.file.path;
    let filename = req.file.filename;
    Listing.image  = { url, filename };
    await Listing.save();
    }
    req.flash("success", "Update successfully !");
    res.redirect(`/login/${id}`);
}

// DESTORY ROUTES --->

module.exports.destory = async (req, res) => {

    const { id } = req.params;
    await Model.findByIdAndDelete(id);
    req.flash("success", "Delete successfully !");
    res.redirect("/login");
}