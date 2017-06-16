// JavaScript30
const msg = new SpeechSynthesisUtterance();
let voices = [];
const voicesDropdown = document.querySelector('[name="voice"]');
const options = document.querySelectorAll('[type="range"], [name="text"]');
const speakButton = document.querySelector('#speak');
const stopButton = document.querySelector('#stop');
msg.text = document.querySelector('[name="text"]').value;

let songs = [];
const songDropdown = document.querySelector('[name="song"]');


//AirTable Songs
var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyyrecXVhTNgIAE4'}).base('appmN77mbEx2MyteS');

base('Songs').select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 10,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
//        console.log('Retrieved', record.get('Name') + ' - ' + record.get('Artist'));
        populateSongs({
            name: record.fields.Name,
            field: record.fields.Artist,
            lyrics: record.fields.Lyrics
        });
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }
});

//AirTable Quotes
base('Quotes').select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 10,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
//        console.log(record.fields.Person + ' - ' + record.fields.Quote);
        populateSongs({
            name: record.fields.Person,
            field: record.fields.Quote
        });
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }
});

// Functions for setting everything
function populateVoices() {
    voices = this.getVoices();
    voicesDropdown.innerHTML = voices
      .filter(voice => voice.lang.includes('en'))
      .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`)
      .join('');
}

function setVoice() {
    msg.voice = voices.find(voice => voice.name === this.value);
    toggle();
}

function populateSongs(object) {
    if (object !== undefined)
        songs.push(object);
//    console.log(songs);
    songDropdown.innerHTML = songs.map(item => `<option value="${item.artist}">${item.name} - ${item.field}</option>`);
//    console.log(songDropdown.innerHTML);
}

function setSong() {
    
}

function toggle(startOver = true) {
    speechSynthesis.cancel();
    if (startOver) {
      speechSynthesis.speak(msg);
    }
}

function setOption() {
    console.log(this.name, this.value);
    msg[this.name] = this.value;
    toggle();
}

speechSynthesis.addEventListener('voiceschanged', populateVoices);
voicesDropdown.addEventListener('change', setVoice);
voicesDropdown.addEventListener('change', setSong);
options.forEach(option => option.addEventListener('change', setOption));
speakButton.addEventListener('click', toggle);
stopButton.addEventListener('click', () => toggle(false));