"use strict";

window.AudioContext = window.AudioContext || window.webkitAudioContext;

/**
 * @constructor
 * @struct
 */
function AudioManager() {
    // the audio context with which to play audio
    var context = new AudioContext(),
        // the timings for playing audio on beat
        TIMINGS = {
            LOOP: 8.000,
            MEASURE: 2.000,
            QUARTER: 0.500
        },
        // the music loops
        loops = {},
        // the filenames of the music loops (1:1)
        loopnames = ["loop_1_2.mp3",
                     "loop_9.mp3",
                     "loop_4.mp3",
                     "loop_7.mp3",
                     "loop_5_2.mp3",
                     "loop_6.mp3",
                     "loop_8.mp3",
                     "loop_2.mp3"],
        // the voices that add flair
        voices = {},
        // the names of the voices
        voicenames = ["vo_break.mp3",
                      "vo_go.mp3",
                      "vo_jump.mp3",
                      "vo_yeah.mp3"],
        // the bass loops that play constantly
        basses = new Array(4),
        // the currently intensity of the bass loop [0,1]
        bassintensity = 0.0,
        // the scratch sound (scratching a record)
        scratch,
        // helper function to load audio
        loadAudio = function (name, bufferfunc) {
            var request = new XMLHttpRequest();
            request.open('GET', "music/" + name, true);
            request.responseType = 'arraybuffer';
            // Decode asynchronously
            request.onload = function () {
                context.decodeAudioData(request.response,
                                        bufferfunc,
                                        function (err) { console.dir(err); }
                                       );
            };
            request.send();
        },
        // helper function to load loop tracks
        loadLoop = function (id) {
            loadAudio(id, function (buffer) {
                loops[id] = { buffer: buffer,
                              source: undefined };
            });
        },
        // helper function to load voice tracks
        loadVoice = function (id) {
            loadAudio(id, function (buffer) {
                voices[id] = { buffer: buffer };
            });
        },
        // helper function to load bass tracks
        loadBass = function (id) {
            loadAudio("beat_level_" + id + ".mp3", function (buffer) {
                basses[id] = { buffer: buffer,
                               source: undefined };
                // start the first bass track when it loads
                if (id === 0) {
                    basses[id].source = context.createBufferSource();
                    basses[id].source.buffer = basses[id].buffer;
                    basses[id].source.connect(context.destination);
                    basses[id].source.loop = true;
                    basses[id].source.start(0, context.currentTime %
                                            TIMINGS.LOOP);
                    bassintensity = 0.0;
                    // refresh the bass track occasionally
                    window.setInterval(function () {
                        var idx = Math.floor((basses.length - 0.1) *
                                             bassintensity);
                        var source = context.createBufferSource();
                        source.buffer = basses[idx].buffer;
                        source.connect(context.destination);
                        source.loop = true;
                        basses[idx].source.stop(0);
                        source.start(0, context.currentTime % TIMINGS.LOOP);
                        basses[idx].source = source;
                    }, 654);
                }
            });
        };
    // Load the loops
    loopnames.map(loadLoop);
    // Load the voices
    voicenames.map(loadVoice);
    // Load the bass tracks
    [0, 1, 2, 3].map(loadBass);
    // Load the scratch sound
    loadAudio('to-hell-with-vinyl.mp3', function (buffer) {
        scratch = buffer;
    });
    /**
     * Gives the offset from the quarter note beat at the time this function
     * is called.  The result is a percentage (expressed as a double) where 0%
     * implies that the current time is exactly on beat and 100% means the
     * current time is exactly between two quarter note beats.
     * @returns {double} The percentage offset from the nearest quarter note
     *                   beat at the time this function is called
     */
    this.quarteroffset = function () {
        //var timeoffset = (context.currentTime % TIMINGS.QUARTER)
        //        - (TIMINGS.QUARTER / 2);
        //var a = 1 - Math.abs(timeoffset / (TIMINGS.QUARTER / 2));
        return 1 - Math.abs(((context.currentTime % TIMINGS.QUARTER) /
                             (TIMINGS.QUARTER / 2)) - 1);
    };
    /**
     * Gives the offset from the downbeat of a measure at the time this
     * function is called.  The result is a percentage (expressed as a double)
     * where 0% implies that the current time is exactly on the downbeat and
     * 100% means the current time is exactly between two downbeats.
     * @returns {number} The percentage offset from the nearest downbeat at
     *                   the time this function is called
     */
    this.measureoffset = function () {
        return 1 - Math.abs(((context.currentTime % TIMINGS.MEASURE) /
                             (TIMINGS.MEASURE / 2)) - 1);
    };
    this.quartercompletion = function() {
        return ((context.currentTime % TIMINGS.QUARTER) / TIMINGS.QUARTER);
    };
    this.measurecompletion = function () {
        return ((context.currentTime % TIMINGS.MEASURE) / TIMINGS.MEASURE);
    };
    /**
     * Toggles the loop with the specified index number (0-indexed).  If the
     * number is outside of the valid index range, nothing happens.
     * @param {number} id The index number of the loop to play
     */
    this.toggleLoop = function (id) {
        if (typeof (id) !== 'number') {
            return;
        }
        id = Math.floor(id);
        if (id < 0 || id >= loopnames.length) {
            return;
        }
        var loop = loops[loopnames[id]];
        if (loop.source) {
            loop.source.stop(0);
            loop.source = undefined;
        } else {
            loop.source = context.createBufferSource();
            loop.source.buffer = loop.buffer;
            loop.source.connect(context.destination);
            loop.source.loop = true;
            loop.source.start(0, context.currentTime % TIMINGS.LOOP);
        }
    };
    /**
     * Plays a voice with the specified index number (0-indexed).  If the
     * number is outside of the valid index range, nothing happens.
     * @param {number} id The index number of the voice to play
     */
    this.playVoice = function (id) {
        if (typeof (id) !== 'number') {
            return;
        }
        id = Math.floor(id);
        if (id < 0 || id >= voicenames.length) {
            return;
        }
        var voice = voices[voicenames[id]],
            contx = context.createBufferSource();
        contx.buffer = voice.buffer;
        contx.connect(context.destination);
        contx.loop = false;
        contx.start(0, 0);
    };
    /**
     * Plays the 'record-scratch' sound immediately when called.
     */
    this.playScratch = function () {
        var contx = context.createBufferSource();
        contx.buffer = scratch;
        contx.connect(context.destination);
        contx.loop = false;
        contx.start(0, 0);
    };
    /**
     * Sets the intensity of the bassline.  An intensity less than 0% is
     * equivalent to 0% and an intensity greater than 100% is equal to 100%.
     * @param {number} intensity The percentage intensity (in decimal) of the
     *                           bassline
     * @returns {number} The new bass intensity after processing the call
     */
    this.setBassIntensity = function (intensity) {
        if (typeof (intensity) !== 'number') {
            return;
        }
        if (intensity > 1.0) {
            intensity = 1.0;
        } else if (intensity < 0.0) {
            intensity = 0.0;
        }
        var current = Math.floor((basses.length - 0.1) * bassintensity),
            next = Math.floor((basses.length - 0.1) * intensity);
        if (current !== next) {
            basses[next].source = context.createBufferSource();
            basses[next].source.buffer = basses[next].buffer;
            basses[next].source.connect(context.destination);
            basses[next].source.loop = true;
            basses[next].source.start(0, context.currentTime % TIMINGS.LOOP);
            basses[current].source.stop(0);
            basses[current].source = undefined;
        }
        bassintensity = intensity;
        return bassintensity;
    };
}
var audioManager = new AudioManager();
