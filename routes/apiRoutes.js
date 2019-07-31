/* eslint-disable indent */
/* eslint-disable camelcase */
const db = require("../models");
const localStorage = require("localStorage");

module.exports = function(app) {
  // ========= CREATE ==========
  app.get("/api/currentUser", (req, res) => {
    let currentUser = JSON.parse(localStorage.getItem("loggedUser"));
    res.json(currentUser);
  });

  app.post("/api/assign", function(req, res) {
    let newAsset = req.body;
    let newAssetAssignment = {};
    switch (newAsset.type) {
      case "hardware":
        newAssetAssignment = {
          hardware_id: newAsset.assetId,
          user_id: newAsset.userID
        };
        db.UserHardware.create(newAssetAssignment).then(function(dbExample) {
          res.json(dbExample);
        });
        break;
      case "software":
        newAssetAssignment = {
          software_id: newAsset.assetId,
          user_id: newAsset.userID
        };
        db.UserSoftware.create(newAssetAssignment).then(function(dbExample) {
          res.json(dbExample);
        });
        break;
      case "accessory":
        newAssetAssignment = {
          accessory_id: newAsset.assetId,
          user_id: newAsset.userID
        };
        db.UserAccessory.create(newAssetAssignment).then(function(dbExample) {
          res.json(dbExample);
        });
    }
  });

  app.post("/api/register", (req, res) => {
    let newUser = req.body;
    db.User.create(newUser).then(dbUser => {
      res.json(dbUser);
    });
  });

  app.post("/api/add", (req, res) => {
    let formInfo = req.body;
    console.log(req.body);

    // get type of asset being added
    switch (formInfo.assetType) {
      case "Hardware":
        let newHardware = {
          manufacturer: formInfo.manufacturer,
          asset_tag: formInfo.asset_tag,
          serial_number: formInfo.serial_number,
          model: formInfo.model,
          asset_type: formInfo.assetType,
          status: formInfo.status,
          eol: formInfo.eol,
          bin_location: formInfo.bin_location,
          user_id: "1",
          date_assigned: null
        };
        db.Hardware.create(newHardware).then(dbUser => {
          res.json(dbUser);
        });
        break;
      case "Software":
        let newSoftware = {
          manufacturer: formInfo.manufacturer,
          product: formInfo.product,
          product_key: formInfo.product_key,
          expiration_date: formInfo.expiration_date,
          license_size: formInfo.license_size,
          license_available: formInfo.license_available
        };
        db.Software.create(newSoftware).then(dbUser => {
          res.json(dbUser);
        });
        break;
      case "Accessory":
        let newAccessory = {
          manufacturer: formInfo.manufacturer,
          model: formInfo.model,
          accessory_type: formInfo.accessory_type,
          quantity_available: formInfo.accessory_type,
          bin_location: formInfo.bin_location
        };
        db.Accessory.create(newAccessory).then(dbUser => {
          res.json(dbUser);
        });
        break;
      default:
        console.log("No assets added");
    }
  });

  app.post("/api/request", (req, res) => {
    let newRequest = req.body;
    console.log(newRequest);
    db.Requests.create(newRequest).then(dbUser => {
      res.json(dbUser);
    });
  });

  app.post("/api/login", (req, res) => {
    let loginUser = req.body;
    db.User.findOne({ where: { username: loginUser.username } }).then(user => {
      if (!user) {
        console.log("No user");
        res.json("No such user");
        return "No such username.";
      } else {
        if (loginUser.password !== user.password) {
          console.log("wrong password");
          res.json("Wrong password");
          return "Incorrect password.";
        } else {
          localStorage.setItem("loggedUser", JSON.stringify(user));
          console.log(`Logged in user "${user.username}" successfully.`);
          res.redirect("/main");
        }
      }
    });
  });

  // =========== READ ==============

  // Get all accessories
  app.get("/api/all-accessories", function(req, res) {
    db.Accessory.findAll().then(function(results) {
      res.json(results);
    });
  });

  // Get all hardware
  app.get("/api/all-hardware", function(req, res) {
    db.Hardware.findAll().then(function(results) {
      res.json(results);
    });
  });

  // Get all software
  app.get("/api/all-software", function(req, res) {
    db.Software.findAll().then(function(results) {
      res.json(results);
    });
  });

  // =========== UPDATE ==============

  // =========== DELETE ==============

  // Delete an example by id
  app.delete("/api/delete/user/:id", function(req, res) {
    db.User.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });
};
