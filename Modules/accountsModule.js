const mongo = require("../connect");
const bcrypt = require("bcrypt");

module.exports.reset = async (req, res, next) => {
  try {
    if (req.body.newPassword === req.body.confirmPassword) {
        const randomString = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, randomString);
        const response = await mongo.selectedDb
        .collection("account")
        .findOneAndUpdate(
          { email: req.body.email },
          { $set:{password: hashedPassword }}
        );
      if (response) {
        res.status(200).send({
          msg: true,
        });
      }
    }else{
        res.status(200).send({
            msg: false,
          });
    }
  } catch (error) {
    res.status(500).send({
      msg: error,
    });
  }
};

module.exports.create = async (req, res, next) => {
  const randomString = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, randomString);
  const account = {
    email: req.body.email,
    password: hashedPassword,
  };
  try {
    const response = await mongo.selectedDb
      .collection("account")
      .insertOne({ ...account });
    if (response) {
      res.status(200).send({
        msg: true,
      });
    }
  } catch (error) {
    if (error) {
      // console.log(error)
      res.status(500).send({
        msg: error,
      });
    }
  }
};

module.exports.search = async (req, res, next) => {
  try {
    const response = await mongo.selectedDb
      .collection("account")
      .find({ email: req.body.email })
      .toArray();
    if (response.length > 0) {
      res.status(200).send({
        msg: true,
      });
    } else {
      res.status(200).send({
        msg: false,
      });
    }
  } catch (error) {
    if (error) {
      // console.log(error)
      res.status(500).send({
        msg: error,
      });
    }
  }
};
