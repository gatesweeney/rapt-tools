import React from "react";
import TagManager from 'react-gtm-module'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"; // Removed "Link"
import { Webp } from "./webp";
import { HEIC } from "./heic";
import { Compressor } from "./compressor";
import { VideoCompressor } from "./videoCompressor";
import './App.css'

function App() {

  const tagManagerArgs = {
    gtmId: 'G-6MWVGFTCPW'
  }
  TagManager.initialize(tagManagerArgs)

  document.title = "RAPT TOOLS"

  return (
    <Router>
      <Navtop />
      <div class="page-wrap">
      {/*<Sidebar />*/}
      <div class="main-content">
      <Switch>
        <Route path="/heic">
          <HEIC />
        </Route>
        <Route path="/webp">
          <Webp />
        </Route>
        <Route path="/compressor">
          <Compressor />
        </Route>
        <Route path="/video">
          <VideoCompressor />
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
    <nav class="navbar navbar-expand-lg bg-light">
          <div class="container-fluid">
            <a class="navbar-brand" href="/">
              <img src="https://uploads-ssl.webflow.com/60d4c76fab23c390f78ec70e/60d4cd3342da20ef0ba3ba9e_rapt-black-thick-14-p-500.png" height="30" class="d-inline-block align-top" alt="logo" loading="lazy"></img>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="/">Home</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/webp">Any to WebP</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/heic">HEIC to JPG</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/compressor">Image Compressor</a>
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
    <div class="d-flex flex-column flex-shrink-0 bg-light sidebar">
      <a href="/" class="d-block p-3 link-dark text-decoration-none" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Icon-only">
      <img src="https://uploads-ssl.webflow.com/60d4c76fab23c390f78ec70e/60d4cd3342da20ef0ba3ba9e_rapt-black-thick-14-p-500.png" height="30" class="d-inline-block align-top" alt="logo" loading="lazy"></img>
      </a>
      <ul class="nav nav-pills nav-flush flex-column mb-auto text-center">
        <li class="nav-item">
          <a href="/" class="nav-link active py-3 border-bottom" aria-current="page" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Home">
            <svg class="bi" width="24" height="24" role="img" aria-label="Home"></svg>
          </a>
        </li>
        <li>
          <a href="/" class="nav-link py-3 border-bottom" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Dashboard">
            <svg class="bi" width="24" height="24" role="img" aria-label="Dashboard"></svg>
          </a>
        </li>
        <li>
          <a href="/" class="nav-link py-3 border-bottom" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Orders">
            <svg class="bi" width="24" height="24" role="img" aria-label="Orders"></svg>
          </a>
        </li>
        <li>
          <a href="/" class="nav-link py-3 border-bottom" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Products">
            <svg class="bi" width="24" height="24" role="img" aria-label="Products"></svg>
          </a>
        </li>
        <li>
          <a href="/" class="nav-link py-3 border-bottom" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Customers">
            <svg class="bi" width="24" height="24" role="img" aria-label="Customers"></svg>
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
      <h1 class="display-3">Welcome to the web tools portal by Gates Sweeney</h1>
      <p class="display-5">Choose a tool to begin</p>
      <div class="flex-horiz">
        <a type="button" class="btn btn-primary btn-lg" href="/webp">Any to WebP Image Converter</a>
        <a type="button" class="btn btn-primary btn-lg" href="/heic">HEIC to JPG Image Converter</a>
        <a type="button" class="btn btn-primary btn-lg" href="/compressor">Image Compressor</a>
        <a type="button" class="btn btn-primary btn-lg" href="/">More Coming Soon</a>
      </div>
    </div>
  )
}
