const socket = io();
const upload = new Upload({ apiKey: "free" });
let canvas = document.getElementById("canvas");
var modal = document.getElementById("myModal");
let btn_c = document.getElementById("close");
let close = document.getElementById("done");
let loader = document.getElementById("load");

const ctx = canvas.getContext('2d'); // get its context


var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);
const vid = document.querySelector('#vidElement');
navigator.mediaDevices.getUserMedia({video: true}) // request cam
.then(stream => {
  vid.srcObject = stream; // don't use createObjectURL(MediaStream)
  return vid.play(); // returns a Promise
})

.then(()=>{ // enable the button
  const btn = document.getElementById('btn');
  btn.onclick = (e) =>{
    modal.style.display = "block";
    takeASnap()
    // .then(download);
};
});

function handleImage(e){
  loader.style.display = "block";
  let con = document.getElementById("cons");
  con.innerHTML = `
      <p style="color:rgb(0,0,0)" id="cons"> analizando ... </p>
      `
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  modal.style.display = "block";
  var reader = new FileReader();
  reader.onload = async function(event){
      var img = new Image();
      img.onload = function(){
          canvas.width = 460;
          canvas.height = 365;
          ctx.drawImage(img, 0,0,460,365);
      }
      img.src = event.target.result;
  }
  reader.readAsDataURL(e.target.files[0]);     
}

const onFileSelected = async (event) => {
  let con = document.getElementById("cons");
  con.innerHTML = `
      <p style="color:rgb(0,0,0)" id="cons"> analizando ... </p>
      `
  const [ file ]    = event.target.files;
  const { fileUrl } = await upload.uploadFile({ file, onProgress });
  // console.log(`File uploaded: ${fileUrl}`);
  socket.emit('ReceiveImURL',{link:fileUrl})
}


function takeASnap(){
    // const ctx = canvas.getContext('2d'); // get its context
    loader.style.display = "block";
    modal.style.display = "block";
    let con = document.getElementById("cons");
    con.innerHTML = `
        <p style="color:rgb(0,0,0)" id="cons"> analizando ... </p>
        `
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = vid.videoWidth; // set its size to the one of the video
    canvas.height = vid.videoHeight;
    ctx.drawImage(vid, 0,0); // the video
    canvas.toBlob(async (blob)=>{
      const { fileUrl } = await upload.uploadFile({ 
      file:{
        name:'image',
        type: blob.type,
        size: blob.size,
        slice: (start, end) => blob.slice(start, end)
      },onProgress });
      console.log(`File uploaded: ${fileUrl}`);
      socket.emit('ReceiveImURL',{link:fileUrl})
    }, 'image/jpeg');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 460;
    canvas.height = 365;
    ctx.drawImage(vid, 0,0,460,365);
    return new Promise((res, rej)=>{
      canvas.toBlob(res, 'image/jpeg'); // request a Blob from the canvas
    });
  }
  const onProgress = ({ progress }) => {
    // console.log(`File uploading: ${progress}% complete.`)
  }
  function download(blob){
    // uses the <a download> to download a Blob
    let a = document.createElement('a'); 
    a.href = URL.createObjectURL(blob);
    a.download = 'screenshot.jpg';
    document.body.appendChild(a);
    a.click();
    let da = canvas.toDataURL('image/jpeg')
  }

btn_c.addEventListener('click',()=>{
    modal.style.display = "none";
})
close.addEventListener('click',()=>{
    modal.style.display = "none";
})

function btnLink(){
  loader.style.display = "block";
  modal.style.display = "block";
  let con = document.getElementById("cons");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  con.innerHTML = `
      <p style="color:rgb(0,0,0)" id="cons"> analizando ... </p>
      `
  let link = document.getElementById("inputLink").value;
  var img = new Image();
  img.onload = ()=>{
    ctx.drawImage(img,0,0,460,365);
  }
  img.src = link;
  socket.emit('ReceiveImURL',{link:link});
}

socket.on('CustomV', msg =>{
    loader.style.display = "none";
    let con = document.getElementById("cons");
    let prb = document.getElementById("prob");
    if(msg.msg.tagName == 'Healthy Lemon' ){
      con.innerHTML = `
      <p style="color:rgb(50,200,50)" id="cons"> Producto apto para consumo</p>
      `
    }
    else{
      con.innerHTML = `
      <p style="color:rgb(200,50,50)" id="cons"> Producto no apto para consumo</p>
      `
    }
    prb.innerText = Math.round((msg.msg.probability)*100) + ' %';
})