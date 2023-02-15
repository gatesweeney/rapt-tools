import WebTorrent from "webtorrent";

const opts = {
    maxConns: 55,        // Max number of connections per torrent (default=55)
    uploadLimit: 0,     // Max upload speed (bytes/sec) over all torrents (default=-1)
  }

const client = new WebTorrent(opts);

async function Stream(magnet) {
    
}

export {  Stream  }