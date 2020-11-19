const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");

const PORT = process.env.PORT || 8080;
const app = express();

app.use(compression());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
