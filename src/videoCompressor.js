import * as React from "react";
import $ from 'jquery';
import saveAs from 'file-saver';


var options = {
  bitrate: 4,
  maxSize: 1920,
  useWebWorker: true,
  alwaysKeepResolution: false,
}



function VideoCompressor() {
  document.title = 'Video Compressor'; 


  
  /*
  const ffmpeg = createFFmpeg({ log: true });
  const transcode = async ({ target: { files } }) => {
    const { name } = files[0];
    await ffmpeg.load();
    ffmpeg.FS('writeFile', name, await fetchFile(files[0]));
    await ffmpeg.run('-i', name,  'output.mp4');
    const data = ffmpeg.FS('readFile', 'output.mp4');
    const video = document.getElementById('player');
    video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
  }
*/

  // Maintain Resolution CSS Switcher
  $(document).on("click", function() { 
    if ($("#keepRes").is(":checked")) {
        $("#maxRes").parent().hide();
    } else {
        $("#maxRes").parent().show();
    } 

  })

  $(document).on("change", "#uploader", async function() {

    const file = document.getElementById("uploader").files[0];

    console.log(file);

  })

  $(document).on("click", "#submit", async function(){

    const file = document.getElementById("uploader").files[0];
    console.log('file processing', file)


    settings();

    $("#settings").hide();
    $("#uploader").hide();
    const original = $("#uploader").files;


    console.log(original);

    var video = await processVideo(original);

    console.log('OUTBLOBS', video);

    saveAs (video, original.name);

    
    // Completed
    $('#reload').text('Convert Again')
    $('#results').hide();
    $('#finished').show();
    // Remove Warning
    window.removeEventListener("beforeunload", warning);

  });

    return (
        <div>
          <h1 class="display-3">Video Compressor</h1><br></br>

          <h1 id="finished">Finished!</h1>

          <div class="container-md" id="settings">
            <h3 class="display-6">Settings</h3>
            <br></br>
            <div class="form-check form-check-inline">
              <input class="form-check-input setting" type="checkbox" id="keepRes" value="option1"></input>
              <label class="form-check-label" for="keepRes">Maintain Resolution</label>
            </div>
            <br></br><br></br>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Max Size</span>
                </div>
                <input  id="maxSize" type="text" class="form-control setting" placeholder="4MB (default)"></input>
            </div>

            <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" >Max Width/Height</span>
                </div>
                <input id="maxRes" type="text" class="form-control setting" placeholder="5000PX (Default = undefined)"></input>
            </div>
          </div>

          <br></br>
          <div class="mb-3">
              <input type="file" class="form-control" id="uploader" accept="audio/*, video/*" disabled=""></input><br></br>
              <div class="row">
                <div class="col-3">
                  <button id="submit" type="submit" class="btn btn-primary">Compress</button>
                </div>
                <div class="col-3">
                  <a class="btn btn-outline-primary" id="reload" href="/compressor">Reload</a>
                </div>
              </div>
          </div>
          <div id="results">
            <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            <div id="loading">Processing <span id="image-now">0</span> / <span id="total-images">0</span> images.</div>
            <br />
            <div id="myProgress">
              <div id="myBar"></div>
            </div>
            <div id="percent"><span>0</span>%</div>
          </div>
        </div>
    )

}

export { VideoCompressor };


async function processVideo(file) {

  $('#results').css("display", "block")
  //Warn before refrshing page
  window.addEventListener("beforeunload", warning);

  

  //return video.src;
}

// Warning Function
function warning(e) {
  var confirmationMessage = 'It looks like you have been editing something. '
                          + 'If you leave before saving, your changes will be lost.';

  (e || window.event).returnValue = confirmationMessage; //Gecko + IE
  return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
}

function settings() {
  var keepRes;
  var maxRes;
  var maxSize;

  maxRes = ($("#maxRes").val());
  maxRes = maxRes.replace(/[^0-9]/g, '');

  maxSize = $("#maxSize").val();
  maxSize = maxSize.replace(/[^0-9]/g, '');

  if (maxRes === '') {maxRes = undefined;}
  if (maxSize === '') {maxSize = 4;}

  keepRes = $("#keepRes").is(":checked");

  console.log(maxRes, maxSize, keepRes);

  options.maxSizeMB = maxSize;
  options.maxWidthOrHeight = maxRes;
  options.alwaysKeepResolution = keepRes;

}