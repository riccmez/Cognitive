const { PredictionAPIClient } = require("@azure/cognitiveservices-customvision-prediction");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");
const fs = require('fs');
const path = require('path');
module.exports = io => {
  io.on('connection', socket => {
    console.log('new socket connected');

    
  socket.on('ReceiveImURL',URL =>{
    CustomVision(URL.link);
  })

  async function CustomVision(customUrl) {
    const customVisionPredictionKey = "f31056a81ea4427f9a03eeaa0f6e611b";
    const customVisionPredictionEndPoint = "https://westus2.api.cognitive.microsoft.com/";
    const projectId = "c91ba702-dd07-40ef-8ff7-42b37ac1f23f"; //process.env["c91ba702-dd07-40ef-8ff7-42b37ac1f23f"] || "<c91ba702-dd07-40ef-8ff7-42b37ac1f23f>";
  
    const credentials = new ApiKeyCredentials({ inHeader: {"Prediction-key": customVisionPredictionKey } });
    const client = new PredictionAPIClient(credentials, customVisionPredictionEndPoint);
    const path_img = '/public/uploads/image.jpg';
    const imageURL =  "https://media.healthyfood.com/wp-content/uploads/2017/03/What-to-do-with-lemons.jpg";
    client
    .classifyImageUrl(projectId, "Iteration4", {url:customUrl})
      .then(result => {
        let message = {msg:result.predictions[0]}
        socket.emit('CustomV',message);
      })
      .catch(err => {
        console.log("An error occurred:");
        console.error(err);
        socket.emit('CustomV',{error:'bad Url'});
      });
  }
});
};


