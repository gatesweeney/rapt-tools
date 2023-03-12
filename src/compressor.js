import React from "react";
import $ from 'jquery';
import imageCompression from "browser-image-compression";
import JSZip from "jszip";
import saveAs from 'file-saver';


var options = {
  maxSizeMB: 4,
  maxWidthOrHeight: 5000,
  useWebWorker: true,
  alwaysKeepResolution: false,
}



function Compressor() {
  document.title = 'Image Compressor'; 

  $(document).on("click", function() { 
    if ($("#keepRes").is(":checked")) {
        $("#maxRes").parent().hide();
    } else {
        $("#maxRes").parent().show();
    } 

  })

  $(document).on("change", "#uploader", async function(){

    settings();

    $("#settings").hide();
    $("#uploader").hide();
    const files = this.files;


    console.log(files);

    $('#total-images').text(String(files.length));

    var blobArray = await processFiles(files);

    console.log('OUTBLOBS', blobArray)

    if (blobArray.length <= 1) {
      for (let a = 0; a < blobArray.length; a++) {   saveAs(blobArray[a].blob, blobArray[a].name)   }
    } else {
      saveZip(blobArray);
    }
    
    // Completed
    $('#reload').text('Convert Again')
    $('#results').hide();
    $('#finished').show();
    // Remove Warning
    window.removeEventListener("beforeunload", warning);

  });

    return (
        <div>
          <h1 className="display-3">Image Compressor</h1><br></br>

          <h1 id="finished">Finished!</h1>

          <div className="container-md" id="settings">
            <h3 className="display-6">Settings</h3>
            <br></br>
            <div className="form-check form-check-inline">
              <input className="form-check-input setting" type="checkbox" id="keepRes" value="option1"></input>
              <label className="form-check-label" for="keepRes">Maintain Resolution</label>
            </div>
            <br></br><br></br>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text">Max Size</span>
                </div>
                <input  id="maxSize" type="text" className="form-control setting" placeholder="4MB (default)"></input>
            </div>

            <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" >Max Width/Height</span>
                </div>
                <input id="maxRes" type="text" className="form-control setting" placeholder="5000PX (Default = undefined)"></input>
            </div>
          </div>

          <br></br>
          <div className="mb-3">
              <input type="file" multiple className="form-control" id="uploader" accept="image/*" disabled=""></input>
              <br></br><a id="reload" href="/compressor">Reload</a>
          </div>
          <div id="results">
            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
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

export { Compressor };


async function saveZip(photos) {

  var zip = new JSZip();


  for (let i = 0; i < photos.length; i++) {
    let blobber = await fetch(photos[i].blob).then(r => r.blob());
    zip.file(photos[i].name, blobber, {base64: true});
  }

  zip.generateAsync({type:"blob"}).then(function(file) {
      saveAs(file, `compressed-${photos.length}.zip`);
  });

};


async function processFiles(files) {
  var file;
  var blobArray = [];
  var prcnt;

  $('#results').css("display", "block")


  //Warn before refrshing page
  window.addEventListener("beforeunload", warning);

  for (let f = 0; f < files.length; f++) {

    window.dataLayer.push({
      event: 'image-conversion',
      eventProps: {
          category: 'conversions',
          action: 'convert',
          label: 'image',
          value: 1
      }
    });

    prcnt = parseInt((f / files.length) * 100);

    $('#image-now').text(String(f + 1));
    $('#myBar').css("width", `${prcnt}%`)
    $('#percent').text(`${prcnt}%`)



    file = files[f];
    var name = file.name;

    var convertedFile = await imageCompression(file, options);

    const blob = URL.createObjectURL(convertedFile);

    blobArray.push({"blob": blob, "name": name});

  }

  return blobArray;
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