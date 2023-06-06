import $ from "jquery";
import GetDomain from "../GetDomain";
import pushTorrents from "./pushTorrents";
import { Torrent } from "./Torrent";

let allListings = [];
let noResults = [];
var seedboxList =[];

export default async function getTorrents(csvData, site, limit, seedMin) {

    $('#results-torrent').show();
    $('#single-form').hide();
    $('#magnet-form').hide();
    $('.form-control').hide();

    var domain = GetDomain()
    var category = 'Movies'; 
    

    // Sets total movies
    $('#total-movies').text(String(csvData.length));

    // loop through csv array
    for (let i = 0; i < csvData.length; i++) {
        // set the search terms
        let percent = parseInt((i / csvData.length) * 100);
        var query = csvData[i];

        $('#percent').find('span').text(percent);
        $('#myBar').css('width', `${percent}%`)
    
        // Loading Results
        $('#current-movie').find('span').text(csvData[i]);
        $('#movie-now').text(String(i));


        // Log movie currently being queried
        console.log(`-------------      NEW MOVIE       --------\n${csvData[i]}`);
        // Remove special characters and URLify the query with %20
        query = query.replace(/[^a-zA-Z0-9 ]/g, '');
        query = query.replaceAll(' ', '%20');
        // URL structure
        var url = `${domain}/api/torrent-search/?search=${query}&limit=${limit}&category=${category}`

        console.log(url);

        $.ajaxSetup({
            "error":function() { console.log('Dummy Error with the request has ocurred.')  }
        });

        // API Call
        await $.getJSON(url, async function (req) {

                
                var options = 0;
                var selection = [];

            

            async function picker(req, seedReq) {
                for (let m = 0; m < req.length; m++) {
                    var results = [];
                    // get size of item
                    var size = String(req[m].size);
                    var title = req[m].title;
                    
                    var resolution;
                    var season;
                    var episode;

                    var seeders = parseInt(req[m].seeds);
                    resolution = parseInt( title.match(/(2160p|1080p|720p|480p|240p)/) );
                    if (isNaN(resolution)) {resolution = 100}
                    season = title.match(/([Ss]?([0-9]{1,2}))[Eex]/);
                    episode = title.match(/([Eex]([0-9]{2})(?:[^0-9]|$))/);

                    try {
                        season = season[0];
                        episode = episode[0];
                    } catch (error) {
                        season = '';
                        episode = '';
                    }
    
                    // set unit to var
                    var sizeUnit = size.match(/[a-zA-Z]+/);
                    
                    //Convert to float
                    var sizeNum = parseFloat(size.match(/[0-9]*\.[0-9]+/))
                    
    
                    var sizeOut;                    
    
                    // Check for unit and convert to MB
                    if (seeders >= seedReq) {
                        options ++;

                        if (sizeUnit == 'GB') {
                            sizeOut = sizeNum * 1024;
                        } else if (sizeUnit == 'KB') {
                            sizeOut = sizeNum / 1024;
                        } else if (sizeUnit == 'MB') {
                            sizeOut = sizeNum;
                        } else {
                            sizeOut = 'DNP';
                        }
                        

                    } else {
                        sizeOut = 'Too Few Seeders';
                    }
                      
                    if (sizeOut < 20000) { 
                        req[m].resolution = resolution;
                        selection.push(req[m]); 
                }
                    
                    
                }

                if (selection.length > 0) {
                    selection.sort(function(b, a) {
                        var keyA = parseFloat(a.resolution),
                            keyB = parseFloat(b.resolution);
                        // Compare the 2 res
                        if (keyA < keyB) return -1;
                        if (keyA > keyB) return 1;
                        return 0;
                    });
                }

                return options;

            }

            

            // Pick the torrent, if there's no listings with seedMin seeders, check again with just 5.
            await picker(req, seedMin);


            // If no results don't add to array but log errors.
            if (selection.length) {
                allListings.push({id: i, which: 0, results: selection, query: query.split('%20').join(' ')})
            } else {
                noResults.push(` - ${query.split('%20').join(' ')}`);
            }

            return allListings;
        }
    )
    } 

    //AFTER FOR LOOP IS COMPLETE

    // Put listings on screen
    console.log('ALL LISTINGS\n', allListings)
    print(allListings);

    $('#results').hide();

    // On Click Statements
    clickers();

    // Reveal buttons1
    $('#submit-torrents').show();
    $('#reload').show();
    $('#log').show();
    $('#results-torrent').hide();

    return allListings;

}

function print(allListings) {

    
    // All Movies Loop
    //if (indexToChange) {index = indexToChange} else {index = 0}

    for (let i = 0; i < allListings.length; i++) {
        
        let queryID = allListings[i].id;
        let query = allListings[i].query;

        // Clear list for new selection items
        var MovieElementList = [];

        for (let s = 0; s < allListings[i].results.length; s++) {
            // First Movie in list
            let curr = allListings[i].results[s];
            let title = curr.title;
            let size = curr.size;
            let resolution = curr.resolution;
            let seeds = curr.seeds;
            let style = "display: none";

            // Make sure first item is visible
            if (s === 0) {style = "display: block"}

            // Set element's description for the current movie's listing
            let desc = `( ${s + 1} / ${allListings[i].results.length} ) | Resolution: ${resolution}p Size: ${size} Seeders: ${seeds} | Query: ${query} | ${title.slice(0,30)}`
            let currEle = `<div style="${style}" class="${s}" title="${title}">${desc}</div>`;
        
            // Push all listings for this movie to an array
            MovieElementList.push(currEle);
        }


        let movieEle = `
        <tr id="${queryID}">
            <td class="prev-btn">
                <button class="btn btn-outline-primary btn-sm">PREV</button>
            </td>
            <td class="next-btn">
                <button class="btn btn-outline-primary btn-sm">NEXT</button>
            </td>
            <td class="info-row">${MovieElementList.join('')}</td>
            <td class="remove-btn">
                <button class="btn btn-outline-primary btn-sm" style="margin-left: 10px;">REMOVE</button>
            </td>
        </tr>
        `;

        // Put movie listing into DOM
        $('#table-body').append(movieEle);
        // Push the movie to the outgoing, changeable list
        seedboxList.push(allListings[i]);

    }


    
    //Results
    $('#complete').show();

    //Set text of results message but replace \n with a break using regex
    var obj = $('#complete').text(`Query Completed. ${allListings.length} titles ready to download.\nThe following queries yielded no results:\n${noResults.join('\n')}`)
    obj.html(obj.html().replace(/\n/g,'<br/>'));
}

function cycle(direction, id) {
    // Get index by id for the movie we are changing
    var toChange = seedboxList.findIndex(x => x.id === id);
    // Num of results for the movie
    var resultsCount = seedboxList[toChange].results.length;
    // ID in the DOM
    var domID = `#${id}`;

    //Hide Existing Result
    var resultClass = `.${seedboxList[toChange].which}`;
    $(domID).find(resultClass).hide();

    // True is forward. Add to which
    if (direction) {seedboxList[toChange].which++} else {seedboxList[toChange].which--}
    // Set boundaries for the selection to be made
    if (  seedboxList[toChange].which < 0  ) {  seedboxList[toChange].which = 0  } else if (  seedboxList[toChange].which > resultsCount - 1   ) {  seedboxList[toChange].which = resultsCount - 1  }

    //Show New Result
    resultClass = `.${seedboxList[toChange].which}`;
    $(domID).find(resultClass).show();
}

async function remove(id) {
    // Get index in seedboxList 
    var toRemove = seedboxList.findIndex(x => x.id === id);
    if (toRemove < 0 ){toRemove = 0}
    console.log(id, toRemove);

    //Set the id to remove and remove it
    var domID = `#${id}`
    $(domID).hide();
    $(domID).remove();
    // Clear listeners and reinstate On Click Statements
    $(document).off();
    await clickers();
    
    //Remove the movie from the seedbox list
    console.log('removed', seedboxList[toRemove].query, '\n', seedboxList);
    seedboxList.splice(toRemove, 1);

    //Reload if no more results
    if (seedboxList.length === 0) {window.location.reload();}
}

async function clickers(){

    // OnClick for each next button
    $(document).on("click", ".next-btn", function (ev) {
        var id = parseInt($(this).parent('tr').attr('id'));
        cycle(true, id)
    });

    // OnClick for each prev button
    $(document).on("click", ".prev-btn", function (ev) {
        var id = parseInt($(this).parent('tr').attr('id'));
        cycle(false, id)
    });

    // OnClick for each remove button
    $(document).on("click", ".remove-btn", function (ev) {
        var id = parseInt($(this).parent('tr').attr('id'));
        remove(id);
    });

    // Manual Log Button
    $('#log').on('click', function() {
        console.log('Manual Log of Seedbox List\n', seedboxList)
    });

    //Click to send to seedbox
    $('#submit-torrents').on('click', async function(ev) {
        var type = GetType()
        if (type === 'none') {
            alert('Please Choose a Type')
            return
        }
        console.log(type)
        console.log('Submitting');
        $(this).text('Sending....')
        var result = await pushTorrents(seedboxList, type);
        if (result) {$(this).text('Sent')} else {$(this).text('Error')}
    });
}

function GetType() {
    if ($('#movies').is(':checked')) {return 'Movies'} else if ($('#tv').is(':checked')) {return 'TV'} else if ($('#other').is(':checked')) { return 'Other'} else { return 'none' }
}

