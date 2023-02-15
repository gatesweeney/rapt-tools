

export default async function pushTorrents(list, domain) {
    console.log(list);

    await fetch(`https://${domain}/api/seedbox/`, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',

    },
    body: JSON.stringify(list)
    })
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))
}