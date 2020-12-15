var express = require('express');
var router = express.Router();
var users = require("../models/userModel");
var multer = require('multer');



// Multer File upload settings
const DIR = './public/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
  }
});


// Multer Mime Type Validation
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  // server.get('/usersList', function(req, res) {
    users.find({}, function(err, users) {
       res.send(users);
    });
// });
});

router.get('/:userId', function(req, res, next) {
  users.findById(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "user not found with id " + req.params.userId
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.userId
        });
    });
});

router.route("/").post(upload.single('pImage'),function(req, res) {
  let url = req.protocol + '://' + req.get('host');
  var user = new users({
    fName: req.body.fName,
    lName: req.body.lName,
    email: req.body.email,
    pNumber: req.body.pNumber,
    pImage:  url + '/public/' + req.file.filename,
  });
  user.save().then(result => {
    console.log(result);
    res.status(201).json({
      message: "User registered successfully!",
      userCreated: {
        result
      }
    })
  }).catch(err => {
    console.log(err),
      res.status(500).json({
        error: err
      });
  })
});

router.route("/:userId").put(upload.single('pImage'),function(req, res) {
  let url = req.protocol + '://' + req.get('host');
  users.findByIdAndUpdate(req.params.userId, {
    fName: req.body.fName,
    lName: req.body.lName,
    email: req.body.email,
    pNumber: req.body.pNumber,
    pImage:  url + '/public/' + req.file.filename,
}, {new: true})
.then(user => {
    if(!user) {
        return res.status(404).send({
            message: "User not found with id " + req.params.userId
        });
    }
    res.send(user);
}).catch(err => {
    if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "User not found with id " + req.params.userId
        });                
    }
    return res.status(500).send({
        message: "Error updating note with id " + req.params.userId
    });
});
});


router.route("/:userId").delete(function(req, res) {
  users.findByIdAndRemove(req.params.userId)
.then(user => {
    if(!user) {
        return res.status(404).send({
            message: "User not found with id " + req.params.userId
        });
    }
    res.send({message:"User deleted successfully!!"});
}).catch(err => {
    if(err.kind === 'ObjectId'|| err.name === 'NotFound') {
        return res.status(404).send({
            message: "User not found with id " + req.params.userId
        });                
    }
    return res.status(500).send({
        message: "Error updating note with id " + req.params.userId
    });
});
});

module.exports = router;
