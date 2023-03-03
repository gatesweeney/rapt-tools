import GetDomain from "../GetDomain";

export default async function pushTorrents(list, type) {

    var toSend = [];
    var domain = GetDomain()

    for (let i = 0; i < list.length; i++) {
        var which = list[i].which;
        toSend.push(list[i].results[which]);
    }

    console.log('Sending to seedbox...\n', toSend);

    try {
        await fetch(`${domain}/api/seedbox/`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(  {torrents: toSend, type: type}  )
        })
        .then(response => response.json())
        .then(response => console.log('response', JSON.stringify(response)))

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

    
}