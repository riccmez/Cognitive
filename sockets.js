const { PredictionAPIClient } = require("@azure/cognitiveservices-customvision-prediction");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");
const fs = require('fs');
const path = require('path');
const request = require('./models/requests')
const router = require('express').Router();
module.exports = io => {
  io.on('connection', socket => {
    console.log('new socket connected');

    
  socket.on('ReceiveImURL',URL =>{
    CustomVision(URL.link);
  })

  socket.on('GetData',msg=>{
    filtered(7);
  })

  function subtractHours(numOfHours, date = new Date()) {
    date.setHours(date.getHours() - numOfHours);
    return date;
  }

  var getDateArray = function(start, end) {

    var
      arr = new Array(),
      dt = new Date(start);
  
    while (dt <= end) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }
  
    return arr;
  
  }

  function format_date(date = new Date()){
    let fecha_hora = (date.getFullYear()).toString();
    if(date.getMonth() <10)
    fecha_hora += '-'+'0'+ (date.getMonth()+1).toString();
    else
      fecha_hora += '-'+(date.getMonth()+1).toString();
    if(date.getDay() <10)
      fecha_hora += '-0'+(date.getDate()).toString();
    else
    fecha_hora += '-'+(date.getDate()).toString();
    return fecha_hora;
  }
  
  function filtered(days){
    var today = new Date(new Date().getTime() + (2* 24 * 60 * 60 * 1000))
    today.setHours(0,0,0,0);
    var week_ago = new Date(today.getTime()  - (days * 24 * 60 * 60 * 1000));
    let collection = getDateArray(week_ago, today)
    let _data = [];
    let idx = 0;
    let idx2 = 0;
    for(var i = 0; i < collection.length - 1 ; i++){
      request.find({time:{$gte:format_date(collection[idx]), $lt:format_date(collection[idx+1])}}).exec((err,entry)=>{
        if(err) console.error(err);
        _data.push([Date.parse(collection[idx2]) , entry.length])
        idx2++;
        if (idx2 == collection.length - 1){
          // console.log(_data)
          let msg = {data:_data}; 
          socket.emit('Showdata',msg);
        }
      })
      idx++;
    }
  }

  function subtractTimeFromDate(objDate, intHours) {
    var numberOfMlSeconds = objDate.getTime();
    var addMlSeconds = (intHours * 60) * 60000;
    var newDateObj = new Date(numberOfMlSeconds - addMlSeconds);
    return newDateObj;
}

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
      var dateEntry = subtractHours(5);
      request.findOne().sort({'_id':-1}).limit(1).exec(async (err,result)=>{
        if (result == null){
          var newReq = new request({
            Id: 1,
            time: dateEntry
          })
          newReq.save((err)=>{
            if(err){console.error(err)}
          })
        }
        else{
          var newReq = new request({
            Id: (result.Id + 1),
            time: subtractTimeFromDate(new Date(),5)
          })
          newReq.save((err)=>{
            if(err){console.error(err)}
          })
        }
      })
  }
});
};


