import React from "react";
import $ from 'jquery';
import simpleColorConverter from 'simple-color-converter'
import { JSONHeroSearch } from "@jsonhero/fuzzy-json-search";
import get from "lodash.get";

const database = 'pantoneids.json';

var idj;

function Pantone() {

    initialize();

    $(document).on('click', "#btn-name", async function() {
        var query = String($('#pName').val());
        console.log('query', query);
        var results = search(query);
        console.log('result\n', results);
        processResults(results);
    })

    return (
        <div>
        <h1 className="display-3">Pantone Search</h1><br></br>

        <div className="container-md" id="settings">
          <br></br>
          <form id="name-form" className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">Pantone Name/ID/HEX</span>
              </div>
              <input  id="pName" type="text" className="form-control setting" placeholder="snow white/11-0703"></input>
              <input className="btn btn-outline-primary" id="btn-name" type="submit"></input>
          </form>
        </div>
        <div id="results">
          <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
          <div id="loading">Processing <span id="image-now">0</span> / <span id="total-images">0</span> images.</div>
          <br />
          <div id="myProgress">
            <div id="myBar"></div>
          </div>
          <div id="percent"><span>0</span>%</div>
        </div>
        <div className="container-md flex-grid">
            <div className="colorbox">
                <div className="color"></div>
                <h5>color name</h5>

                <button className="btn btn-secondary btn-sm copy hex">HEX: <span></span></button><br></br>
                <button className="btn btn-secondary btn-sm copy rgb">RGB: <span></span></button><br></br>
                <button className="btn btn-secondary btn-sm copy cmyk">CMYK: <span></span></button><br></br>

            </div>
        </div>
      </div>
    );

}


export { Pantone };

function search(query, type) {

    $('.flex-grid').empty();

    const searcher = new JSONHeroSearch(idj);
    var result = searcher.search(query);
    return result; 
}


// Just to get page ready
async function initialize() {
    await $.getJSON(database,
        function (data, textStatus, jqXHR) {
            idj = data;
            console.log(data);
        }
    );



    $(document).on("submit", "#name-form", function(e) {
        e.preventDefault();
    })
}

function processResults(array) {

    for (let i = 0; i < array.length; i++) {
        var path = array[i].item.split('.')[1];
        var obj = get(idj, path);

        var name = obj.name;
        name = name.replace('-', ' ');
        var hex = (obj.hex).toUpperCase();

        var pantone = new simpleColorConverter({
            color: hex, 
            to: 'pantone'
        })

        console.log(pantone);

        var rgba = new simpleColorConverter({
            color: hex, 
            to: 'rgba'
        })

        var cmyk = new simpleColorConverter({
            color: hex, 
            to: 'cmyk'
        })

        console.log(cmyk.color.c)

        rgba = `${rgba.color.r}, ${rgba.color.g}, ${rgba.color.b}, ${rgba.color.a}`

        cmyk = `${cmyk.color.c}, ${cmyk.color.m}, ${cmyk.color.y}, ${cmyk.color.k}`


        pastele(name, hex, rgba, cmyk, pantone);        

    }
    // Add hover events
    hovers();

}

function pastele(name, hex, rgb, cmyk, pantone) {
    // Builds element to be appended and puts it in DOM
    var element = (
        `<div class="colorbox">
                <div class="color" style="background-color: #${hex}"></div>
                <h5>${name}</h5>
                <button class="btn btn-secondary btn-sm copy hex">HEX: <span>#${hex}</span></button>
                <button class="btn btn-secondary btn-sm copy rgb">RGB: <span>${rgb}</span></button>
                <button class="btn btn-secondary btn-sm copy cmyk">CMYK: <span>${cmyk}</span></button>
                <button class="btn btn-secondary btn-sm copy pantone">PAN: <span>${pantone.color}</span></button>
        </div>`
    )

    $('.flex-grid').append(element);
}

function hovers() {
    // Hover Event handlers. Stores existing text and replaces with "copy"
    var curr;

    $(".copy").on("mouseenter", function() {
        curr = $(this).text();
        $(this).text('Click to Copy');
    })

    $('.copy').on('click', function() {
        var toCopy = curr.split(': ')[1];
        // Copy the text inside the text field
        navigator.clipboard.writeText(toCopy);
        $(this).text('Copied!');
    })

    // returns text to original on mouse leave
    $(".copy").on("mouseleave", function() {
        $(this).text(curr);
    })


}