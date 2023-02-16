import { useState } from "react";
import React from "react";
import Papa from "papaparse";
import getTorrents from "./getTorrent";
import $ from "jquery";


let site = 'piratebay';
// Limits torrent listings
const limit = '30';
// Sets a minimum for seeders
const seedMin = '15';
var allListings = [];


function Torrent() {

  $('#complete').hide();
  // State to store parsed data
  const [parsedData, setParsedData] = useState([]);
  //State to store table Column name
  const [tableRows, setTableRows] = useState([]);

  //State to store the values
  const [values, setValues] = useState([]);

  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];

        // Iterating data to get column name and their values
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
          return 'done'
        });

        // Parsed Data Response in array format
        setParsedData(results.data);

        // Create array and push movie names to it
        let movieList = [];
        for (let i = 0; i < results.data.length; i++) {
          var query = [results.data[i].Movie, results.data[i].Year].join(' ');
          movieList.push(query);
        }

        //Log the list for debug purposes
        console.log(movieList);

        //Call the API
        for (let i = 0; i === 0; i++) {
          allListings = getTorrents(movieList, site, limit, seedMin);
        }
        // Filtered Column Names
        setTableRows(rowsArray[0]);

        // Filtered Values
        setValues(valuesArray);
      },
    });
  };

  $(document).on("click", "#torrent-single-submit", function(e){  e.preventDefault();  })

  async function singleTorrent() {
     
    var query = $("#torrent-query").val();
    if (query !== '') {
      var movieList = [query];
      allListings = getTorrents(movieList, site, limit, seedMin);
    }
  }

  $('.masterList').html(allListings);

  var out = (
      <div>
        <h1 className="display-3">Torrent Search</h1>
        <p>You may upload a CSV file with the headers 'Movie' and 'Year', or search single movies below.</p>
        <p>To view the status of active torrents <a href="/seedstatus">click here</a></p>
        <input
          type="file"
          className="form-control"
          name="file"
          onChange={changeHandler}
          accept=".csv"
        />
        <br />
        <br />
        <div>
          <form id="single-form" className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">Search</span>
              </div>
              <input  id="torrent-query" type="text" className="form-control setting" placeholder="Avengers Endgame 2019" autoFocus={true}></input>
              <input className="btn btn-outline-primary" id="torrent-single-submit" type="submit" onClick={singleTorrent}></input>
          </form>
        </div>
        <br></br>
        <div id="results-torrent">
          <div id="current-movie">Searching movie: <span>movie</span></div>
          <br />
          <div id="loading">Processed <span id="movie-now">0</span> / <span id="total-movies">0</span> movies.</div>
          <br />
          <div id="myProgress">
            <div id="myBar"></div>
          </div>
          <div id="percent"><span>0</span>%</div>
        </div>
        <br />
        <div id="complete"></div>
        <br />
        <br />
        <br />
        <br />
        <table>
          <thead>
          </thead>
          <tbody id="table-body">
          </tbody>
        </table>
        <br>
        </br>
        <div className="flex-horiz">
          <button className="btn btn-outline-primary" id="submit-torrents">Send to Seedbox</button>
          <a className="btn btn-outline-primary" id="watch-torrents" href="/torrent">Reload</a>
          <button className="btn btn-outline-primary" id="get-magnets">Get Magnet(s) - Unavailable </button>

        </div>
      </div>
    );
    return out;
  }

  


export { Torrent };


/*

{values.map((value, index) => {
              return (
                <tr className="tRow" key={index}>
                  {value.map((val, i) => {
                    return <td key={i}>{val}</td>;
                  })}
                </tr>
              );
            })}


            */