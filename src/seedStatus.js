import React from "react";
import $ from 'jquery';
import GetDomain from "./GetDomain";

var endpoint = `${GetDomain()}/api/seedbox`;


function SeedStatus() {

    setInterval(getJSON, 1200);

    return (
        <div>
          <h1 className="display-3">Seedbox Status</h1>
          <a href="/torrent">Back to Search</a><br></br><br></br><br></br><br></br>
          <p className="loading">Loading...</p>
          <p className="empty">There are currently no active torrents</p>
          <div className="container torrent-list">

          </div>
        </div>
    )

}

export { SeedStatus };


async function getJSON() {
  $('.loading').hide();
  await $.getJSON(endpoint,
    function (data) {
      var json = data.json;
      var space = (data.space["size-bytes"] / 1099511627776).toFixed(2);
      var path = data.space.path;
      var removed = json.removed;
      var torrents = json.torrents;
      if (torrents.length === 0 ){
        $('.empty').show();
        $('.container').empty();
      } else {

        $('.empty').hide();

        $('.container').empty();


        // Show space
        $('.container').append(`<p>Space remaining on server: <b>${space} TB</b></p><br></br>`)

        for (let i = 0; i < torrents.length; i++) {

          var name = torrents[i].name;
          var id = torrents[i].id;
          var dlSpeed = (torrents[i].rateDownload / 1048576).toFixed(2);
          var size = (torrents[i].sizeWhenDone / 1024 / 1024 / 1024).toFixed(2);
          var percent = parseFloat(torrents[i].percentDone * 100).toFixed(2);


          var ele = `
        
          <div class="row">
            <div class="col tlist-item">
              ${name}
            </div>
            <div class="col tlist-item">
              Size: ${size} GB | Speed: ${dlSpeed} MB/s | ${percent}% Complete
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