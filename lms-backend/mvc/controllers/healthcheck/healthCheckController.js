const healthCheckModel = require('../../models/healthCheckModel.js');

const healthCheck = async(req,res)=>{
    let healthCheckData = await healthCheckModel.find({});
    if(healthCheckData.length>0)
    {
        res.status(200).send({"message":"Server and DB are Up and Healthy!"})
    }
    else{
        res.status(500).send({"message":"DB is Down!"});
    }
}
module.exports={healthCheck};