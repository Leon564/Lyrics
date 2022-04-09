const lyrics = require("../src/index.js");

lyrics("sparkle")
  .then(console.log)
  .catch((err) => console.log(err));
