import React from "react";
import $ from 'jquery';
import heic2any from "heic2any";
import JSZip from "jszip";
import saveAs from 'file-saver';

function HEIC() {


  document.title = 'HEIC Converter'; 



  $(document).on("change", "#uploader", async function(){

    $("#uploader").hide();
    const files = this.files;


    console.log(files);

    $('#total-images').text(String(files.length));

    var blobArray = await processFiles(files);

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
          <h1 class="display-3">HEIC Converter</h1><br></br>

          <h1 id="finished">Finished!</h1>
          <div class="mb-3">
              <input type="file" multiple class="form-control" id="uploader" accept="image/heic" disabled=""></input>
              <br></br><a id="reload" href="/heic">Reload</a>
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

export { HEIC };


async function saveZip(photos) {

  var zip = new JSZip();


  for (let i = 0; i < photos.length; i++) {
    let blobber = await fetch(photos[i].blob).then(r => r.blob());
    console.log(blobber);
    zip.file(photos[i].name, blobber, {base64: true});
  }

  zip.generateAsync({type:"blob"}).then(function(file) {
      saveAs(file, `heic-converted-${photos.length}.zip`);
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
    var newName = name.replace(extension, "jpg")

    var blob = await heic2any({ blob: file, toType: "image/jpeg", quality: 1 }).then(
      (newImage) => {
        console.log("new image:", newImage);
        const bloburl = URL.createObjectURL(newImage);
        return bloburl;
      }
    );

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

