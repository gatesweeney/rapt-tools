import React from "react";
import './App.css'
import TagManager from 'react-gtm-module'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"; // Removed "Link"
import { Webp } from "./webp";
import { HEIC } from "./heic";
import { Compressor } from "./compressor";
import { Pantone } from "./pantone";
import { Torrent } from "./torrent/Torrent"
import SeedStatus from "./seedStatus";
import { TorFile } from "./TorFile";
import { NoSleep } from "./nosleep";




function App() {

  const tagManagerArgs = {
    gtmId: 'G-6MWVGFTCPW'
  }
  TagManager.initialize(tagManagerArgs)

  document.title = "RAPT TOOLS"

  return (
    <Router>
      <Navtop />
      <div className="page-wrap">
      {/*<Sidebar />*/}
      <div className="main-content">
      <Switch>
        <Route path="/heic">
          <HEIC />
        </Route>
        <Route path="/pantone">
          <Pantone />
        </Route>
        <Route path="/webp">
          <Webp />
        </Route>
        <Route path="/compressor">
          <Compressor />
        </Route>
        <Route path="/torrent">
          <Torrent />
        </Route>
        <Route path="/seedstatus">
          <SeedStatus />
        </Route>
        <Route path="/torfile">
          <TorFile />
        </Route>
        <Route path="/nosleep">
          <NoSleep />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
      </div>
      </div>
    </Router>
  );
}

export default App;


function Navtop() {
  return (
    <nav className="navbar navbar-expand-lg bg-light">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              <img src="https://uploads-ssl.webflow.com/60d4c76fab23c390f78ec70e/60d4cd3342da20ef0ba3ba9e_rapt-black-thick-14-p-500.png" height="30" className="d-inline-block align-top" alt="logo" loading="lazy"></img>
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/">Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/webp">Any to WebP</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/heic">HEIC to JPG</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/compressor">Image Compressor</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/pantone">Pantone</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
  )
}

/*
function Sidebar() {
  return (
    <div className="d-flex flex-column flex-shrink-0 bg-light sidebar">
      <a href="/" className="d-block p-3 link-dark text-decoration-none" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Icon-only">
      <img src="https://uploads-ssl.webflow.com/60d4c76fab23c390f78ec70e/60d4cd3342da20ef0ba3ba9e_rapt-black-thick-14-p-500.png" height="30" className="d-inline-block align-top" alt="logo" loading="lazy"></img>
      </a>
      <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
        <li className="nav-item">
          <a href="/" className="nav-link active py-3 border-bottom" aria-current="page" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Home">
            <svg className="bi" width="24" height="24" role="img" aria-label="Home"></svg>
          </a>
        </li>
        <li>
          <a href="/" className="nav-link py-3 border-bottom" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Dashboard">
            <svg className="bi" width="24" height="24" role="img" aria-label="Dashboard"></svg>
          </a>
        </li>
        <li>
          <a href="/" className="nav-link py-3 border-bottom" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Orders">
            <svg className="bi" width="24" height="24" role="img" aria-label="Orders"></svg>
          </a>
        </li>
        <li>
          <a href="/" className="nav-link py-3 border-bottom" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Products">
            <svg className="bi" width="24" height="24" role="img" aria-label="Products"></svg>
          </a>
        </li>
        <li>
          <a href="/" className="nav-link py-3 border-bottom" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Customers">
            <svg className="bi" width="24" height="24" role="img" aria-label="Customers"></svg>
          </a>
        </li>
      </ul>

    </div>
  )
}
*/


function Home() {

  return (
    <div>
      <title>RAPT TOOLS</title>
      <h1 className="display-3">Welcome to the web tools portal by Gates Sweeney</h1>
      <p className="display-5">Choose a tool to begin</p>
      <div className="flex-horiz">
        <a type="button" className="btn btn-primary btn-lg" href="/webp">Any to WebP Image Converter</a>
        <a type="button" className="btn btn-primary btn-lg" href="/heic">HEIC to JPG Image Converter</a>
        <a type="button" className="btn btn-primary btn-lg" href="/compressor">Image Compressor</a>
        <a type="button" className="btn btn-primary btn-lg" href="/pantone">Pantone</a>
      </div>
    </div>
  )
}
