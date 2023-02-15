import $ from "jquery";
import pushTorrents from "./pushTorrents";


let titles = [];
let errors = [];
let allListings = [];
var roll = [];

export default async function getTorrents(csvData, site, limit, seedMin) {


    $('#results-torrent').show();

    var domain = 'gatesweeney.com'
    var category = 'Movies'; 
    
    var masterList =[];

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
        var url = `http://${domain}/api/torrent-search/?search=${query}&limit=${limit}&category=${category}`

        console.log(url);

        $.ajaxSetup({
            "error":function() { console.log('Error with the request has ocurred.')  }
        });

    // API Call
        await $.getJSON(url, async function (req) {

                var title = '#';
                var fallbackMessage;
                
                var sizes = [];
                var options = 0;
                var selection = [];

            

            async function picker(req, seedReq) {
                for (let m = 0; m < req.length; m++) {
                    // get size of item
                    var size = String(req[m].size);
                    title = req[m].title;
                    var resolution;
                    var season;
                    var episode;

                    var seeders = parseInt(req[m].seeds);
                    resolution = parseInt( title.match(/(2160p|1080p|720p|480p|240p)/) );
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
                        sizes.push(`Resolution: ${resolution}p Size: ${sizeNum} ${sizeUnit} - ${sizeOut} MBs Seeders: ${seeders}`);
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
                    console.log(selection);

                }

                return options;

            }

            

            // Pick the torrent, if there's no listings with seedMin seeders, check again with just 5.
            await picker(req, seedMin);
            

            let desc;


            try {
                desc = `Resolution: ${selection[0].resolution}p Size: ${selection[0].size} MBs Seeders: ${selection[0].seeds} | ${selection[0].title.slice(0, 40)}`;
                allListings.push(selection);
                title = selection[0].title;
                titles.push(title);
                roll.push({"index": 0})
              }
              catch(err) {
                console.log(`******** Couldn't find movie: ${csvData[i]}`)
                errors.push(csvData[i]);
                title = '#';
                selection[0] = 'null';
                desc = "Couldn't find a listing for this query";
            }

            masterList.push(selection[0]);


            // Reporting for errors.
            if (fallbackMessage === undefined) {fallbackMessage = '';}



            let ele = `<tr><td class="next-btn"><button class="btn btn-outline-primary btn-sm">NEXT</button></td><td class="fraction"></td><td class="info-row">${masterList.length - 1} <span>${desc}</span></td></tr>`;


            //Add row to column
            $('tbody').append(ele);

            return allListings;
        }
    )
    } 

    //var magString = JSON.stringify(masterList);



    $('#results').hide();
    $('#complete').show();
    $('#complete').text(`Query Completed. ${titles.length} titles ready to download.`)

    console.log('MASTER LIST:\n', masterList);

    console.log('ROLL ARRAY\n', roll);


    // OnClick for each next button
    $(document).on("click", ".next-btn", function (ev) {
        // Get correct row
        var num = $(this).siblings('.info-row').html();
        
        

        // Get number from text at beginning of row, and report it to console. Current index number for listing
        num = parseInt(num.split(' ')[0]);
        // Go ahead and advance to next listing.
        

        // Fetch results for current listing, and add to the index in the roll sheet or reset if at the end.
        var array = allListings[num];
        roll[num].index ++;

        if (roll[num].index === array.length) {
            roll[num].index = 0;
        }

        // Set index of current result being displayed for the current listing and show it in the UI.
        var fraction = `<td>( ${roll[num].index + 1} / ${array.length} )</td>`;
        $('.fraction').eq(num).html(fraction);


        console.log('LISTING', num, 'RESULT', roll[num].index + 1);


        var out = array[roll[num].index];

        // Report current array result
        console.log('CHANGED TO:\n', out);

        //Modify the html for ease of use.
        var descriptor = `Resolution: ${out.resolution}p Size: ${out.size} MBs Seeders: ${out.seeds} | ${out.title.slice(0, 40)}`;
        $(this).siblings('.info-row').find('span').html(descriptor);

        // Modify the masterList
        masterList[num] = out;
        console.log('MASTER LIST MODIFIED\n', masterList);

    });

    if (masterList.length < 2) {  $('#watch-torrents').show();  }

    $('#submit-torrents').show();

    $('#watch-torrents').on('click', function () {
        console.log('requesting stream\n', masterList[0]);
        
    });

    $('#submit-torrents').on('click', function(ev) {
        pushTorrents(masterList, domain);
    });

    $('#results-torrent').hide();


    return allListings;

}


