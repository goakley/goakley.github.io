"use strict";

/**
 * @constructor
 * @struct
 */
function GraphicsManager() {
    var images = {},
        spritesheets = {},
        loadImage = function (name) {
            var nice = name.substr(0, name.lastIndexOf('.'))
                    .replace(/[./]/g, "_");
            var image = new Image();
            image.onload = function () {
                images[nice] = image;
            };
            image.src = "images/" + name;
            console.log(image.src);
        },
        loadSheet = function (name) {
            var nice = name.substr(0, name.lastIndexOf('.'))
                    .replace(/[./]/g, "_");
            var image = new Image();
            image.onload = function () {
                spritesheets[nice] = image;
            };
            image.src = "images/" + name;
            console.log(image.src);
        },
        dohit = 0,
        lighton = false,
        light,
        keys = {87: false, 65: false, 83: false, 68: false,
                38: false, 37: false, 40: false, 39: false},
        playerimagecount = 6,
        playerimage = 0,
        meterLevel = 0,
        crowdmems = [];
    ['background.png',
     'beat_meter_background.png',
     'beat_meter_node.png',
     'beat_meter_outline.png',
     'beat_meter_hit.png',
     'table.png',
     'laptop_2.png',
     'keys_box.png',
     'key_w.png',
     'key_a.png',
     'key_s.png',
     'key_d.png',
     'key_up.png',
     'key_left.png',
     'key_right.png',
     'key_down.png',
     'lighting_red.png',
     'lighting_green.png',
     'lighting_blue.png',
     'crowd_meter_white.png',
     'crowd_meter_red.png',
     'crowd_meter_max.png',
     'crowd_meter_outline.png'].map(loadImage);
    ['sm_speakers_sheet.png',
     'sm_speakers_sheet_r.png',
     'lg_speakers_sheet.png',
     'lg_speakers_sheet_r.png',
     'disc_sheet.png',
     'lights_sheet.png',
     'lights_sheet_r.png',
     'player_sheet.png',
     'arm_sheet.png',
     'crowd_dude_sheet.png'].map(loadSheet);
    this.update = function(context, beatcompletion, measurecompletion) {
        // calculate frame offsets
        var frame2 = Math.floor(beatcompletion*2);
        var frame3 = Math.floor(beatcompletion*4);
        if (frame3 == 3) {
            frame3 = 1;
        }
        var frame4 = Math.floor(beatcompletion*4);
        // clear the screen (with the background)
        context.drawImage(images.background, 0, 0);
        // draw the player
        // celestia have mercy on my soul
        var pimage = playerimage;
        var psheet = spritesheets.player_sheet;
        switch(pimage) {
        case 0:
            context.drawImage(psheet,
                              (psheet.width / 3) * frame3, 0, 
                              psheet.width / 3,
                              psheet.height / playerimagecount,
                              250, 75,
                              psheet.width / 3,
                              psheet.height / playerimagecount);
            break;
        case 1:
            context.drawImage(psheet,
                              (psheet.width / 3) * frame2,
                              (psheet.height / playerimagecount),
                              psheet.width / 3,
                              psheet.height / playerimagecount,
                              250, 75,
                              psheet.width / 3,
                              psheet.height / playerimagecount);
            break;
        case 2:
            context.drawImage(psheet,
                              (psheet.width / 3) * frame2,
                              (psheet.height / playerimagecount) * 2,
                              psheet.width / 3,
                              psheet.height / playerimagecount,
                              250, 75,
                              psheet.width / 3,
                              psheet.height / playerimagecount);
            break;
        case 3:
            context.drawImage(psheet,
                              0, (psheet.height / playerimagecount) * 3,
                              psheet.width / 3,
                              psheet.height / playerimagecount,
                              250, 75,
                              psheet.width / 3,
                              psheet.height / playerimagecount);
            break;
        case 4:
            context.drawImage(psheet,
                              (psheet.width / 3) * frame2,
                              (psheet.height / playerimagecount) * 4,
                              psheet.width / 3,
                              psheet.height / playerimagecount,
                              250, 75,
                              psheet.width / 3,
                              psheet.height / playerimagecount);
            break;
        case 5:
            context.drawImage(psheet,
                              (psheet.width / 3) * frame3,
                              (psheet.height / playerimagecount) * 5,
                              psheet.width / 3,
                              psheet.height / playerimagecount,
                              250, 75,
                              psheet.width / 3,
                              psheet.height / playerimagecount);
            break;
        }
        // draw the meter
        context.drawImage(images.beat_meter_background, 25, 0);
        context.drawImage(images.beat_meter_node,
                          80 + (measurecompletion * 665), 0);
        context.drawImage(images.beat_meter_outline, 25, 0);
        // draw a hit beat and clear the marker
        if (dohit) {
            context.drawImage(images.beat_meter_hit,
                              80 + (measurecompletion * 665 - 25), 0);
            dohit--;
        }
        // draw the speakers
        var sm_speakers_width = spritesheets.sm_speakers_sheet.width / 3;
        context.drawImage(spritesheets.sm_speakers_sheet,
                          sm_speakers_width * frame3, 0,
                          sm_speakers_width,
                          spritesheets.sm_speakers_sheet.height,
                          100, 250,
                          sm_speakers_width,
                          spritesheets.sm_speakers_sheet.height);
        var sm_speakers_r_width = spritesheets.sm_speakers_sheet_r.width / 3;
        context.drawImage(spritesheets.sm_speakers_sheet_r,
                          sm_speakers_r_width * frame3, 0,
                          sm_speakers_r_width,
                          spritesheets.sm_speakers_sheet_r.height,
                          600, 250,
                          sm_speakers_r_width,
                          spritesheets.sm_speakers_sheet_r.height);
        var lg_speakers_width = spritesheets.lg_speakers_sheet.width / 3;
        context.drawImage(spritesheets.lg_speakers_sheet,
                          lg_speakers_width * frame3, 0,
                          lg_speakers_width,
                          spritesheets.lg_speakers_sheet.height,
                          175, 200,
                          lg_speakers_width,
                          spritesheets.lg_speakers_sheet.height);
        var lg_speakers_r_width = spritesheets.lg_speakers_sheet_r.width / 3;
        context.drawImage(spritesheets.lg_speakers_sheet_r,
                          lg_speakers_r_width * frame3, 0,
                          lg_speakers_r_width,
                          spritesheets.lg_speakers_sheet_r.height,
                          525, 200,
                          lg_speakers_r_width,
                          spritesheets.lg_speakers_sheet_r.height);
        // draw some silly rectangle
        //context.setFillColor(Math.random()*0.1+0.4,Math.random()*0.1+0.4,Math.random()*0.1 + 0.4, 1);
        context.fillRect(267.5, 312.5, 275, 50);
        //context.setFillColor(0,0,0,0);
        // draw the table
        context.drawImage(images.table, 250, 250);
        var disc_sheet_width = spritesheets.disc_sheet.width / 5;
        context.drawImage(spritesheets.disc_sheet,
                          disc_sheet_width * frame4, 0,
                          disc_sheet_width, spritesheets.disc_sheet.height,
                          273, 260,
                          disc_sheet_width, spritesheets.disc_sheet.height);
        context.drawImage(spritesheets.disc_sheet,
                          disc_sheet_width * frame4, 0,
                          disc_sheet_width, spritesheets.disc_sheet.height,
                          399, 259,
                          disc_sheet_width, spritesheets.disc_sheet.height);
        // draw light emitters
        context.drawImage(spritesheets.lights_sheet,
                          (lighton ? spritesheets.lights_sheet.width/2 : 0),
                          0,
                          spritesheets.lights_sheet.width/2,
                          spritesheets.lights_sheet.height,
                          0,325,
                          spritesheets.lights_sheet.width/2,
                          spritesheets.lights_sheet.height);
        context.drawImage(spritesheets.lights_sheet_r,
                          (lighton ? spritesheets.lights_sheet_r.width/2 : 0),
                          0,
                          spritesheets.lights_sheet_r.width/2,
                          spritesheets.lights_sheet_r.height,
                          750,325,
                          spritesheets.lights_sheet_r.width/2,
                          spritesheets.lights_sheet_r.height);
        // draw the key guides
        context.drawImage(images.keys_box, 50, 75);
        context.drawImage(images.keys_box, 600, 75);
        context.drawImage(images.key_w,
                          (keys[87] ? images.key_w.width/2 : 0), 0,
                          images.key_w.width/2, images.key_w.height,
                          100, 80,
                          images.key_w.width/2, images.key_w.height);
        context.drawImage(images.key_a,
                          (keys[65] ? images.key_a.width/2 : 0), 0,
                          images.key_a.width/2, images.key_a.height,
                          70, 95,
                          images.key_a.width/2, images.key_a.height);
        context.drawImage(images.key_d,
                          (keys[68] ? images.key_d.width/2 : 0), 0,
                          images.key_d.width/2, images.key_d.height,
                          130, 95,
                          images.key_d.width/2, images.key_d.height);
        context.drawImage(images.key_s,
                          (keys[83] ? images.key_s.width/2 : 0), 0,
                          images.key_s.width/2, images.key_s.height,
                          100, 110,
                          images.key_s.width/2, images.key_s.height);
        context.drawImage(images.key_up,
                          (keys[38] ? images.key_up.width/2 : 0), 0,
                          images.key_up.width/2, images.key_up.height,
                          650, 80,
                          images.key_up.width/2, images.key_up.height);
        context.drawImage(images.key_left,
                          (keys[37] ? images.key_left.width/2 : 0), 0,
                          images.key_left.width/2, images.key_left.height,
                          620, 95,
                          images.key_left.width/2, images.key_left.height);
        context.drawImage(images.key_right,
                          (keys[39] ? images.key_right.width/2 : 0), 0,
                          images.key_right.width/2, images.key_right.height,
                          680, 95,
                          images.key_right.width/2, images.key_right.height);
        context.drawImage(images.key_down,
                          (keys[40] ? images.key_down.width/2 : 0), 0,
                          images.key_down.width/2, images.key_down.height,
                          650, 110,
                          images.key_down.width/2, images.key_down.height);
        // update the player arm
        // oh no
        var asheet = spritesheets.arm_sheet;
        switch(pimage) {
        case 1:
            context.drawImage(asheet,
                              0, 0, 
                              asheet.width / 4, asheet.height,
                              250, 75,
                              asheet.width / 4, asheet.height);
            break;
        case 2:
            context.drawImage(asheet,
                              asheet.width / 4, 0, 
                              asheet.width / 4, asheet.height,
                              250, 75,
                              asheet.width / 4, asheet.height);
            break;
        //case 3:
        //    context.drawImage(asheet,
        //                      (asheet.width / 4) * 2, 0, 
        //                      asheet.width / 4, asheet.height,
        //                      250, 75,
        //                      asheet.width / 4, asheet.height);
        //    break;
        case 4:
            context.drawImage(asheet,
                              (asheet.width / 4) * 3, 0, 
                              asheet.width / 4, asheet.height,
                              250, 75,
                              asheet.width / 4, asheet.height);
        }
        // draw the laptop
        context.drawImage(images.laptop_2, 484,245);
        // update the crowd
        //???
        var mlevel = meterLevel;
        var thiscrowd = crowdmems.sort(function (a, b) {
            if (a.y > b.y)
                return 1;
            if (a.y < b.y)
                return -1;
            return 0;
        });
        var csheet = spritesheets.crowd_dude_sheet;
        var cdraw = {x:0,y:0,w:csheet.width/6,h:csheet.height/4};
        if (mlevel < 0.30) {
            cdraw.x = (csheet.width / 6) * frame3;
            cdraw.y = 0;
        } else if (mlevel < 0.60) {
            cdraw.x = (csheet.width / 6) * frame3;
            cdraw.y = csheet.height / 4;
        } else if (mlevel < 0.90) {
            cdraw.x = (csheet.width / 6) * frame3;
            cdraw.y = (csheet.height / 4) * 2;
        } else {
            cdraw.x = (csheet.width / 6) * frame3;
            cdraw.y = (csheet.height / 4) * 3;
        }
        for (var i = 0; i < thiscrowd.length; i++) {
            context.drawImage(csheet,
                              cdraw.x, cdraw.y,
                              cdraw.w, cdraw.h,
                              thiscrowd[i].x, thiscrowd[i].y,
                              cdraw.w, cdraw.h);
        }
        //???
        // draw the overlight if there is one
        if (lighton) {
            context.drawImage(light, 0, 0);
        }
        // draw the crowd meter
        var mwidth = images.crowd_meter_red.width * mlevel;
        context.drawImage(images.crowd_meter_white, 175, 525);
        if (mlevel < 0.98) {
            context.drawImage(images.crowd_meter_red,
                              0, 0,
                              mwidth, images.crowd_meter_red.height,
                              175, 525,
                              mwidth, images.crowd_meter_red.height);
            context.drawImage(images.crowd_meter_outline, 175, 525);
        } else {
            context.drawImage(images.crowd_meter_max, 175, 525);
        }
    };
    /**
     * Registers a visual hit.  On the next update, the GUI will show the
     * 'hit' mark on the meter.
     */
    this.visualHit = function() {
        dohit = 6;
    };
    /**
     * Toggles a specific light number to 'on'.  If light number 0 is
     * selected, lighting will be turned off.  An out-of-range number will do
     * nothing.
     * @param {number} id The light to turn on
     */
    this.showLight = function(id) {
        if (typeof (id) !== 'number') {
            return;
        }
        id = Math.floor(id);
        if (id < 0 || id > 3) {
            return;
        }
        switch(id) {
        case 1:
            light = images.lighting_red;
            break;
        case 2:
            light = images.lighting_green;
            break;
        case 3:
            light = images.lighting_blue;
            break;
        }
        if (id === 0) {
            lighton = false;
        } else {
            lighton = true;
        }
    };
    /**
     * Toggle a key to be active or inactive.  This allows the GUI to show 
     * what keys have been actived by the user and which are dormant.  If an
     * unused key is specified, nothing happens
     * @param {number} key The key code for the key to toggle
     * @returns {boolean|undefined} The state of the key, or undefined if your
     *                              argument is invalid
     */
    this.toggleKey = function(key) {
        if (typeof (key) !== 'number') {
            return undefined;
        }
        key = Math.floor(key);
        if (keys[key] === undefined) {
            return undefined;
        }
        keys[key] = !keys[key];
        return keys[key];
    };
    /**
     * Change the image of the player to the specified image ID.
     * @param {number} id The ID of the player image to display
     */
    this.playerPic = function(id) {
        if (typeof (id) !== 'number') {
            return;
        }
        id = Math.floor(id);
        if (id < 0 || id >= playerimagecount) {
            return;
        }
        playerimage = id;
    };
    /**
     * Set the level of the crowd meter (between 0 and 1 inclusive).
     * @param {number} value The percentage (expressed as a decimal) filled
     *                       that the crowd meter is
     * @returns {number|undefined} The new crowd meter level
     */
    this.setMeterLevel = function(value) {
        if (typeof (value) !== 'number') {
            return undefined;
        }
        if (value < 0) {
            value = 0;
        } else if (value > 1) {
            value = 1;
        }
        meterLevel = value;
        var pcount = Math.floor(meterLevel * 10);
        crowdmems.splice(pcount);
        var diff = pcount - crowdmems.length;
        for (var i = 0; i < diff; i++) {
            crowdmems.push({x: Math.random() * 700 - 25,
                            y: 225 + Math.random() * 75});
        }
        return meterLevel;
    };
}
var graphicsManager = new GraphicsManager();
