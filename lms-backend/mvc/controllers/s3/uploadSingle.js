const { uploadFileToS3 } = require("./s3");

const uploadSingle = async (req, res) => {
    try{
    var fileExtension = req.files[0].originalname.split('.').pop();
    var uploadData = await uploadFileToS3('',Date.now()+'LMS.'+fileExtension,req.files[0].buffer);
    // console.log(uploadData);
    res.status(200).send({"message":"Uploaded file successfully","location":uploadData.Location});
    }
    catch(e){
        console.log(e);
        res.status(500).send({"message":"Something went wrong"});
    }
}
module.exports = {uploadSingle};