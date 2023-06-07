import React from "react";
import $ from 'jquery';
import useSound from 'use-sound';
import alert from './alert.wav';

const audio = new Audio(alert);
audio.loop = true;

let sleeping = false;
let start = false;


function NoSleep() {

    setInterval(sleepCheck, 40000)

    $(document).on('click', '#sleeper', function() {
        $(this).text('PRESS')
        start = true
        sleeping = false
        audio.play()
        audio.pause()
        console.log('pressed')
    })

    return (
        <div>
          <h1 className="display-3">No Sleep</h1><br></br>
        <p>Press the button every 40 seconds or an alarm will sound.</p>
        <button id="sleeper" className="sleepbtn">PRESS TO START</button>
        </div>
    )

}
export { NoSleep };


function sleepCheck() {
    if (sleeping && start) {
        audio.play()
    } else {
        audio.pause()
    }
    
    sleeping = true
}