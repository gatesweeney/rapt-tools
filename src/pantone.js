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
        // hide error message
        $("#no-results").hide()
        var query = String($('#pName').val());
        if (query === '') {window.location.reload()} else {
        console.log('query', query);
        var results = search(query);
        console.log('result\n', results);
        processResults(results);
        }
    })

    return (
        <div>
        <h1 className="display-3">Pantone Search</h1><br></br>
        <p>Search from (I'm pretty sure) all Pantones via Name, 12-3456 code format, 123C code format, or HEX code. Will return non-exact search results</p>
        <div className="container-md" id="settings">
          <br></br>
          <form id="name-form" className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">Search</span>
              </div>
              <input  id="pName" type="text" className="form-control setting" placeholder="snow white/11-0703/#F4F5F0/201C" autoFocus={true}></input>
              <input className="btn btn-outline-primary" id="btn-name" type="submit"></input>
          </form>
        </div>
        <div id="loading">
          <br></br><div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>
        <div className="container-md flex-grid">
            
        </div>
        <h4 id="no-results">No Results...</h4>
      </div>
    );

}


export { Pantone };

function search(query, type) {

    $('.flex-grid').empty();

    const searcher = new JSONHeroSearch(idj);
    var result = searcher.search(query);
    console.log(result);
    // if search fails show message
    if (result.length === 0) {$("#no-results").show()}
    return result; 
}


// Just to get page ready
async function initialize() {

    await $.getJSON(database,
        function (data, textStatus, jqXHR) {
            idj = data;
        }
    );

    const array = Object.values(idj);
    const keys = Object.keys(idj);

    for (let i = 0; i < array.length; i++) {

        var name = array[i].name;
        name = name.replace('-', ' ');
        var hex = (array[i].hex).toUpperCase();
        var code = keys[i];

        var pantone = new simpleColorConverter({
            color: hex, 
            to: 'pantone'
        })

        var rgba = new simpleColorConverter({
            color: hex, 
            to: 'rgba'
        })

        var cmyk = new simpleColorConverter({
            color: hex, 
            to: 'cmyk'
        })

        var obj = get(idj, keys[i]);

        obj.pantone = pantone.color;

        rgba = `${rgba.color.r}, ${rgba.color.g}, ${rgba.color.b}, ${rgba.color.a}`
        cmyk = `${cmyk.color.c}, ${cmyk.color.m}, ${cmyk.color.y}, ${cmyk.color.k}`


        pastele(code, name, hex, rgba, cmyk, pantone);        

    }
    

    $('#loading').hide();


    hovers();

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

        var rgba = new simpleColorConverter({
            color: hex, 
            to: 'rgba'
        })

        var cmyk = new simpleColorConverter({
            color: hex, 
            to: 'cmyk'
        })

        rgba = `${rgba.color.r}, ${rgba.color.g}, ${rgba.color.b}, ${rgba.color.a}`

        cmyk = `${cmyk.color.c}, ${cmyk.color.m}, ${cmyk.color.y}, ${cmyk.color.k}`


        pastele(path, name, hex, rgba, cmyk, pantone);        

    }
    // Add hover events
    hovers();
    

}

function pastele(code, name, hex, rgb, cmyk, pantone) {
    // Builds element to be appended and puts it in DOM
    var element = (
        `<div class="colorbox">
                <div class="color" style="background-color: #${hex}"><p>Click and hold to preview</p></div>
                <h5>${name}</h5>
                <p>${code}</p>
                <button class="btn btn-secondary btn-sm copy hex">HEX: <span>#${hex}</span></button>
                <button class="btn btn-secondary btn-sm copy rgb">RGB: <span>${rgb}</span></button>
                <button class="btn btn-secondary btn-sm copy cmyk">CMYK: <span>${cmyk}</span></button>
                <button class="btn btn-secondary btn-sm copy pantone">PAN: <span>${pantone.color}</span></button>
                <div class="color-full" style="background-color: #${hex};"><div>

        </div>`
    )

    $('.flex-grid').append(element);
}

function hovers() {
    // Hover Event handlers. Stores existing text in 'curr' and replaces with "copy"
    var curr;


    $(".copy").on("mouseenter", function() {
        curr = $(this).text();
        $(this).text('Click to Copy');
    })

    //Full screen color preview and info to do so.
    $(".color").on('mousedown', function() {
        $(this).siblings('.color-full').show()
    })

    $(document).on('mouseup', function() {
        $('.color-full').each(function() {$(this).hide()})
    })
    // "Click to show full preview" hover events
    $(".color").on('mouseenter', function(){
        $(this).children('p').show();
    })

    $(".color").on('mouseleave', function(){
        $(this).children('p').hide();
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