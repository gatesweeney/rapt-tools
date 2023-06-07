import React from "react";
import $ from 'jquery';
import Box from '@mui/material/Box';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { Button } from '@mui/material';


var endpoint = `https://api.gatesweeney.com/api/seedbox`;


const columns = [
  {
    field: 'tID',
    headerName: 'Torrent',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    editable: true,
  },
  {
    field: 'speed',
    headerName: 'Speed',
    width: 150,
    editable: true,
  },
  {
    field: 'size',
    headerName: 'Size',
    type: 'number',
    width: 110,
    editable: false,
  },
  {
    field: 'completed',
    headerName: 'Completed',
    type: 'number',
    width: 110,
    editable: false,
  },
];

var rows = []


function SeedStatus() {
  const apiRef = useGridApiRef();


    setInterval(getJSON(apiRef), 1200);

    return (
        <div>
          <h1 className="display-3">Seedbox Status</h1>
          <a href="/torrent">Back to Search</a><br></br><br></br><br></br><br></br>
          <p className="loading">Loading...</p>
          <p className="empty">There are currently no active torrents</p>
          <div className="container torrent-list">
          
          </div>
          <Box sx={{ height: "auto", width: '100%' }}>
            <DataGrid
              apiRef={apiRef}
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 20,
                  },
                },
              }}
              pageSizeOptions={[20]}
              disableRowSelectionOnClick
              //onCellClick={handleCellClick}
              //onRowClick={handleRowClick}
            />
          </Box>
        </div>
    )

}

export { SeedStatus };


async function getJSON(apiRef) {
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

        $('.tremove').each(function () {
          $(this).on('click', function() {
            var id = $(this).attr('id')
            // TODO call api to remove
          })
        })


        // Show space
        $('.container').append(`<p>Space remaining on server: <b>${space} TB</b></p><br></br>`)


        

        for (let i = 0; i < torrents.length; i++) {

          var name = torrents[i].name;
          var id = torrents[i].id;
          var dlSpeed = (torrents[i].rateDownload / 1048576).toFixed(2);
          var size = (torrents[i].sizeWhenDone / 1024 / 1024 / 1024).toFixed(2);
          var percent = parseFloat(torrents[i].percentDone * 100).toFixed(2);

          var row = {id: i+1, tid: id, name: name, speed: dlSpeed, size: size, completed: percent}

  


          var ele = `
        
          <div class="row">
            <div class="col tlist-item">
              <a href="#" class='tremove' id="${id}">Remove</a>
            </div>
            <div class="col tlist-item" title="${name}">
              ${name.slice(0,40)}
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