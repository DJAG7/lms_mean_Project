const dotenv = require("dotenv");
dotenv.config();
const request = require("request");
function doRequest(url) {
  return new Promise(function (resolve, reject) {
    request({ url: url, encoding: "binary" }, (error, response, body) => {
      if (error) {
        console.log(error);
        reject("");
      }
      let base64 = `data:${
        response.headers["content-type"]
      };base64,${Buffer.from(body, "binary").toString("base64")}`;
      resolve(base64);
    });
  });
}
const getImageProxyHandler = async (url) => {
  try {
    let res = await doRequest(url);
    return res;
  } catch (e) {
    console.log(e);
    return "";
  }
};
module.exports = { getImageProxyHandler };
