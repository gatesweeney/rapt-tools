import React from "react";
import $ from 'jquery';
import convertToWebp from "webp-converter-clientside";
import JSZip from "jszip";
import saveAs from 'file-saver';






function Webp() {

  

  $(document).on("change", "#uploader", async function(){

    $("#uploader").hide();
    const files = this.files;


    var blobArray = await processFiles(files);

    console.log(blobArray);

    if (blobArray.length === 1) {
      saveAs(blobArray[0].blob, blobArray[0].name)
    } else {
      saveZip(blobArray);
    }



  });



    

    return (
        <div class="container-fluid ptb30">
          <div class="mb-3">
              <label class="form-label" for="disabledCustomFile">Image Upload</label>
              <input type="file" multiple class="form-control" id="uploader" accept="image/*" disabled=""></input>
              <img id="preview" className="ptb30" alt=""></img>
            </div>
        </div>
    )

}

export { Webp };


async function saveZip(photos) {

  console.log(photos);

  var zip = new JSZip();


  for (let i = 0; i < photos.length; i++) {
    zip.file(photos[i].name, photos[i].blob);
  }

  zip.generateAsync({type:"blob"}).then(function(file) {
      saveAs(file, `converted-${photos.length}.zip`);
  });

};


async function processFiles(files) {
  var file;
  var blobArray = [];

  for (let f = 0; f < files.length; f++) {
    file = files[f];
    var name = file.name;
    var extension = name.split('.')[1];
    var newName = name.replace(extension, "webp")

    console.log(name, newName);


    const convertedFile = await convertToWebp(file, 0.7)

    const blob = window.URL.createObjectURL(convertedFile);

    blobArray.push({"blob": blob, "name": newName});
    
  }

  return blobArray;
}