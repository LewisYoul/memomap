var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multer = require('multer')
var bodyParser = require('body-parser')

let Pin = require('../models/pins.js')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage }).single('image');

router.get('', function(req, res) {
  Pin.find(function(err, pins) {
    res.send(pins);
  });
});

router.post('/users_pins', function(req, res) {
  Pin.find({ userFbId: req.body.userFbId }, function(err, pins) {
    res.send(pins)
  })
})

router.post('/new', function(req, res) {
  var pin = new Pin(req.body)
  pin.save(function(err) {
    if(err) throw err;
  });
  res.send(pin)
});



router.post('/update', function(req, res) {
  upload(req, res, function (err) {
    console.log("BODY", req.body)
      Pin.findByIdAndUpdate(req.body._id, {
        place: req.body.place,
        memory: req.body.memory,
        imageurl: req.body.imageurl,
        activity: req.body.activity,
        rating: req.body.rating,
        date: new Date()
       }, function(err, pin) {
        if (err) throw err;
        console.log(pin)
      });
    if (err) {
      console.log("image not uploaded")
      // An error occurred when uploading
    }
      res.send({
        place: req.body.place,
        memory: req.body.memory,
        imageurl: req.body.imageurl,
        activity: req.body.activity,
        rating: req.body.rating,
        date: new Date()
      })
  })
});

router.post('/delete', function(req, res) {
  Pin.findOneAndRemove({_id: req.body._id}, function(err){
    if (err) throw err
  })
  res.sendStatus(200)
});

module.exports = router;
