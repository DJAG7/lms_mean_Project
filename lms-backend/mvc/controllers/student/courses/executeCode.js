const { default: axios } = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const COMPILER_URL = `${process.env.COMPILER_URL}submission?base64_encoded=true&wait=true`;

function removeSpecialCharacters(inputString) {
  return inputString.replace(/[^\x20-\x7E\n\t]/g, "");
}
function decodeString(encoded) {
  return removeSpecialCharacters(atob(encoded));
}
const executeCode = async (req, res) => {
  // console.log(req.body);
  try {
    if (!req.body.code || !req.body.language) {
      res.status(200).send({ Output: "" });
      return;
    }
    var lang = {
      python: 71,
      java: 62,
      c_cpp: 54,
      csharp: 51,
      golang: 60,
      javascript: 63,
    };
    // console.log(lang[req.body.language]);
    const options = {
      method: "POST",
      url: "COMPILER_URL",
      headers: {
        "content-type": "application/json",
      },
      data: {
        cpu_time_limit: 1.0,
        language_id: lang[req.body.language],
        stdin: btoa(req.body.input),
        source_code: btoa(req.body.code),
      },
    };
    let result = await axios.request(options);
    result = result.data;
    if (result && result.stdout) {
      res.status(200).send({ Output: decodeString(result.stdout) });
    } else {
      if (
        result &&
        result.status &&
        result.status.id &&
        result.status.id == 6
      ) {
        res.status(200).send({ Output: decodeString(result.compile_output) });
      } else {
        // console.log("COMPILER ERROR",result);
        if (result && result.status && result.status.id) {
          if (result.status.id == 5) {
            res.status(200).send({ Output: "Time Limit Exceeded" });
            return;
          }
        }
        res.status(200).send({ Output: decodeString(result.stderr) });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "something went wrong",
      Output: "Please Check for Errors/Invalid characters",
    });
  }
};
module.exports = { executeCode };
