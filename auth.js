const privatekey = require("./config/config").jwt.privateKey;
const jwt = require("jsonwebtoken");

const ensureAuthorization = (req) => {
  try {
    let recevedJWT = req.headers["authorization"];
    console.log("recevedJWT : ", recevedJWT);

    if (recevedJWT) {
      let decodedJWT = jwt.verify(recevedJWT, privatekey);
      return decodedJWT;
    } else {
      throw new ReferenceError("jwt must be provided");
    }
  } catch (error) {
    console.log(error.name);
    console.log(error.message);

    return error;
  }
};

module.exports = ensureAuthorization;
