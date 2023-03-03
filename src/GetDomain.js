export default function GetDomain() {
    if (window.location.href.includes('localhost')) {  return 'http://localhost'  } else {  return 'https://api.gatesweeney.com'  }
}