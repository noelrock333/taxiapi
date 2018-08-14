const multer = require('multer');
const uuid = require('uuid/v4');

const storage =  multer.diskStorage({
  destination: function(req, file, cb){
    cb(null,'./uploads/')
  },
  filename: function(req, file, cb){
    const extention = file.mimetype.split('/')[1]
    cb(null, `${uuid()}.${extention}`);
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({storage, fileFilter});

module.exports = {upload};
