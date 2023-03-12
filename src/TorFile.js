import React from "react";
import $ from 'jquery';

var endpoint = `https://api.gatesweeney.com/torfile`;


function TorFile() {

    setInterval(getJSON, 10000);

    return (
        <div>
          <h1 className="display-3">Other Files</h1>
          <a href="/torrent">Back to Search</a><br></br><br></br><br></br><br></br>
          <p className="loading">Loading...</p>
          <p className="empty">Directory is empty</p>
          <div className="container torrent-list">

          </div>
        </div>
    )

}

export { TorFile };


async function getJSON() {
  $('.loading').hide();
  await $.getJSON(endpoint,
    function (data) {
      var files = data.files
      if (files.length === 0 ){
        $('.empty').show();
        $('.container').empty();
      } else {

        $('.empty').hide();

        $('.container').empty();

        $('.tremove').each(function () {
          $(this).on('click', function() {
            var name = $(this).attr('id')
            // TODO call api to remove
          })
        })


        for (let i = 0; i < files.length; i++) {

          var name = files[i];


          var ele = `
        
          <div class="row">
            <div class="col tlist-item">
              ${name}
            </div>
            <div class="col tlist-item">
              <a href="${endpoint + '/files/' + name}" download class='filedl'>Download</a>
            </div>
            <div class="col tlist-item">
              <a href="#" class='tremove' id="${name}">Remove</a>
            </div>

          </div>
          
          
          <br></br>
        
          `
          
          $('.container').append(ele);
          
        }


      }

      


    }
  );
}