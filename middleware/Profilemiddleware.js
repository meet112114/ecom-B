const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UserPro  = require('../models/userProfile') 




const GetProfile = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken;
    if (!token) {
      return res.status(401).send('Unauthorized: No token provided');
    }
   
    const decodedToken = jwt.verify(token , process.env.SECRET_KEY);
    const rootUser = await User.findOne({ email : decodedToken.email });
    

    if (!rootUser) {
      return res.status(401).send('Unauthorized: User not found');
    }
     
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    const userProfile = await UserPro.findOne({refId:rootUser._id})
    next();
  } catch (err) {
    res.status(401).send('Unauthorized: No valid token found');
    console.log(err);
  }
};

module.exports = GetProfile;