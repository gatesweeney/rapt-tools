

export default async function pushTorrents(list) {

    var toSend = [];
    var domain = 'api.gatesweeney.com';

    for (let i = 0; i < list.length; i++) {
        var which = list[i].which;
        toSend.push(list[i].results[which]);
    }

    console.log('Sending to seedbox...\n', toSend);

    try {
        await fetch(`https://${domain}/api/seedbox/`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',

        },
        body: JSON.stringify(toSend)
        })
        .then(response => response.json())
        .then(response => console.log(JSON.stringify(response)))

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

    
}