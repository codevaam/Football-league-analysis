const mongoose = require("mongoose");

exports.connect = async function (host) {
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  };
  await mongoose.connect(host, opts, function() {
    console.log("Connected to mongodb!");
  });
}

exports.disconnect = async function() {
    await mongoose.disconnect();
}
