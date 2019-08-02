const multer = require('multer');
const uuid = require('uuid/v4');

const storage =  multer.diskStorage({
  destination: function(req, file, cb){
    const path = () => {
      switch(file.fieldname){
        case 'profile_image':
          return 'driver_profile_images';
        case 'public_service_permission_image':
          return 'driver_service_permission_images';
      }
    }
    cb(null,`./uploads/${path()}`);
  },
  filename: function(req, file, cb){
    const extention = file.mimetype.split('/')[1]
    cb(null, `${uuid()}.${extention}`);
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({storage, fileFilter});

module.exports = {upload};
