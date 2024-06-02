const dotenv = require("dotenv");
dotenv.config();
const getImageProxyApi = async (req, res) => {
  try {
    switch (req.query.responseType) {
      case "blob":
        req.pipe(request(req.query.url).on("error", next)).pipe(res);
        break;
      case "text":
      default:
        request(
          { url: req.query.url, encoding: "binary" },
          (error, response, body) => {
            if (error) {
              res.status(500).send({
                error: error,
              });
              return next(error);
            }
            res.status(200).send({
              base64: `data:${
                response.headers["content-type"]
              };base64,${Buffer.from(body, "binary").toString("base64")}`,
            });
          }
        );
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "something went wrong" });
  }
};
module.exports = { getImageProxyApi };
