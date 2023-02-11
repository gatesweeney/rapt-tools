import React from "react";
import $ from 'jquery';
import convertToWebp from "webp-converter-clientside";
import JSZip from "jszip";
import saveAs from 'file-saver';

var compression = 0.7;



function Webp() {


  document.title = 'Any to WebP'; 



  $(document).on("change", "#uploader", async function(){

    $("#uploader").hide();
    const files = this.files;

    console.log(files);

    $('#total-images').text(String(files.length));

    var blobArray = await processFiles(files);

    if (blobArray.length <= 5) {
      for (let a = 0; a <blobArray.length; a++) {   saveAs(blobArray[a].blob, blobArray[a].name)   }
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
          <h1 className="display-3">Any to WebP Converter</h1><br></br>

          <div className="container-md">
            <label id="compression-label" for="compression" className="form-label">Compression: 0.7:1 (default)</label><br></br>
            <input id="compression" type="range" onInput={compressionVal} className="form-range" min="0.1" max="1" step="0.1"></input>
            <br></br><br></br>
          </div>

          <h1 id="finished">Finished!</h1>
          <div className="mb-3">
              <input type="file" multiple className="form-control" id="uploader" accept="image/*" disabled=""></input>
              <br></br><a id="reload" href="/webp">Reload</a>
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

export { Webp };


async function saveZip(photos) {

  var zip = new JSZip();


  for (let i = 0; i < photos.length; i++) {
    let blobber = await fetch(photos[i].blob).then(r => r.blob());
    console.log(blobber);
    zip.file(photos[i].name, blobber, {base64: true});
  }

  zip.generateAsync({type:"blob"}).then(function(file) {
      saveAs(file, `webp-converted-${photos.length}.zip`);
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

    prcnt = parseInt((f / files.length) * 100);

    $('#image-now').text(String(f + 1));
    $('#myBar').css("width", `${prcnt}%`)
    $('#percent').text(`${prcnt}%`)



    file = files[f];
    var name = file.name;
    // Gets last array item when split by a period
    var extension = name.split('.').slice(-1)[0] ;
    var newName = name.replace(extension, "webp")

    const convertedFile = await convertToWebp(file, parseFloat(compression))

    const blob = window.URL.createObjectURL(convertedFile);

    console.log(blob);

    blobArray.push({"blob": blob, "name": newName});

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

  
function compressionVal(val){  
  val = $('#compression').val();
  compression = val;
  $('#compression-label').text(  `Compression: ${val}:1`  )
} 
  