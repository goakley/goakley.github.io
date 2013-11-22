---
layout: post
title:  "How To Give Your Character Bionic Legs"
date:   2013-11-22
---

Games are excellent at taking an unfairly complicated task and making it look so very simple and smooth.

![Screenshot](/imgs/game_scene.jpg)
<small>Not pictured: thousands of pointers and hundreds of skipped meals</small>

Let's talk about movement.  Movement is one of those things that you have to accept is harder than just pressing a key and having the game jump you forward in a smooth fashion.  People seem to have perfected twisting their bodies into exotic shapes, and here I am with the choice between sleeping and seeing if I can make my character tilt her head (spoiler alert: my bed is warm and comfortable).  But I digress.  Right now, let's focus on moving something at all, in at least a slightly realistic manner.  This method was developed in OpenGL using C for first-person views, but there is no OpenGL code in this explanation and it's not locked to first-person gaming.

Let's start simple.  For the player to even technically exist, she needs to be somewhere in space.  And since we want to be able to see the world, we need to be able to define some direction she's looking in (or at least something she's looking at, but we'll do the former).

```c
#define DIR_FORWARD  0x01
#define DIR_BACKWARD 0x02
#define DIR_LEFT     0x04
#define DIR_RIGHT    0x08
short player_dir = 0; // start off with no direction
vec3f player_pos = {0, 0, 0}; // at origin
vec3f player_rot = {0, 0, 0}; // without having rotated
```

Alright, so there's some funky stuff you probably didn't expect in here.  First of all, while the player can be rotated around any of the three axes, for the purposes of movement, only rotation around the y-axis matters, because that is the axis coming out of the character's head that determines the direction she is facing.  And what's with these DIR_ values?  Well, it turns out that getting input suddenly becomes extremely simple when mapping WASD / UDLR directly to some values to later be processed by the game engine.  Remember, a very basic game loop is `input -> update -> render`; we don't want to be updating the player position and such while we're still processing input.  For those of you who are currently wondering why I'm multiplying a bunch of values by 0, what I've done is define a bit mask for direction.  `0x01` is actually a hexadecimal number.  I've assigned the numbers 1, 2, 4, and 8 to forward, backward, left, and right, respectively, which conveniently is the same as associating bits 0, 1, 2, and 3 with forward, backward, left, and right.  Notice how the player direction is a `short`?  By using DIR_ as a mask, we can store all the possible directions in a small amount of space.  Neat!  The next chunk of code will show the nitty gritty details of how this actually works.

How about we actually grab the input now?  This code was changed to use some genericized library; just know that `event` is the input event that occurred and `key` is the key value associated with that event.  Note that if the player tries to move in some direction, we disable movement in the opposite direction, because that would be strange and silly if the character were to try to move backward and forward at the same time.

```c
void input(short event, char key)
{
  if (event == EVENT_PRESS) {
    if (key == 'W' || key == 'w' || key == KEY_UP) {
      player_dir &= ~DIR_BACKWARD;
      player_dir |= DIR_FORWARD;
    } else if (key == 'S' || key == 's' || key == KEY_DOWN) {
      player_dir &= ~DIR_FORWARD;
      player_dir |= DIR_BACKWARD;
    } else if (key == 'A' || key == 'a' || key == KEY_LEFT) {
      player_dir &= ~DIR_RIGHT;
      player_dir |= DIR_LEFT;
    } else if (key == 'D' || key == 'd' || key == KEY_RIGHT) {
      player_dir &= ~DIR_LEFT;
      player_dir |= DIR_RIGHT;
    }
  } else if (event == EVENT_RELEASE) {
    if (key == 'W' || key == 'w' || key == KEY_UP)
      player_dir &= ~DIR_FORWARD;
    } else if (key == 'S' || key == 's' || key == KEY_DOWN) {
      player_dir &= ~DIR_BACKWARD;
    } else if (key == 'A' || key == 'a' || key == KEY_LEFT) {
      player_dir &= ~DIR_LEFT;
    } else if (key == 'D' || key == 'd' || key == KEY_RIGHT) {
      player_dir &= ~DIR_RIGHT;
    }
  }
}
```

Beautiful.  **Note:** When we say the player is moving left and right, that means the character will literally be moving to the left and to the right (some games would have the character rotate when those keys are pressed instead).

The `update()` function is going to be a bit of a doozy; this is where the magic happens.  But first, think about when you move for a second.  You certainly don't suddenly shoot off at your top speed instantaneously.  Thus, neither can the character (it feels quite awkward if you've ever experienced controls like that).  So we need to at least account for character velocity / speed, and slowly increase it as the character moves to her top speed and decrease it as the player stops trying to move (which means we need to know the information from the previous update, hence the `static` declarations):

```c
void update(unsigned time_delta)
{
  static float player_speed = 0;
  static vec3f player_last = {0,0,0}; // the previous velocity
  vec3f player_vel = {0,0,0}; // the velocity this time around
```

Now, we have the direction(s) the player wants to move in, and we have his rotation, which can give us the actual forward/left/right/backward vectors in the scene.  Bonus points if you remember your unit circle and trig functions, because that's the core of the following bit, which calculates the player's velocity vector based on the direction their facing.  Note that we are also marking if the character moved at all; this will come in handy soon.

```c
  char moved = 0; // did the player try to move?
  if (player_dir & DIR_FORWARD) {
    player_vel.x += sin(player_rot.y);
    player_vel.z += cos(player_rot.y);
    moved = 1;
  }
  if (player_dir & DIR_BACKWARD) {
    player_vel.x += -sin(player_rot.y);
    player_vel.z += -cos(player_rot.y);
    moved = 1;
  }
  if (player_dir & DIR_RIGHT) {
    player_vel.x += -cos(player_rot.y);
    player_vel.z += sin(player_rot.y);
    moved = 1;
  }
  if (player_dir & DIR_LEFT) {
    player_vel.x += cos(player_rot.y);
    player_vel.z += -sin(player_rot.y);
    moved = 1;
  }
```

If you're unsure why we picked certain trig functions and negations for certain movement directions, try drawing out your unit circle and picking some arbitrary rotation for the player's facing direction and performing the trig functions.  No, I mean it, draw it right now, I promise you'll feel accomplished once you understand the logic.

The direction of movement / velocity isn't good enough for moving the player (well, it is, but we won't settle for the sub-par movement described earlier), so we need to also figure out the character's speed, which in this case is how fast she's travelling regardless of direction.  We're capping this between 0 and 1, because there's nothing slower than not moving and because we don't want the character shooting off at light speed.

The reason we kept track of whether or not the character should move is because we need to speed her up if she did and slow her down if she didn't.  The reason we keep track of the previous update's velocity direction is because we need the character to continue moving until her speed reaches zero even if the player no longer wants to move.

```c
  if (moved) {
    player_speed += 0.1;
  } else {
    player_speed -= 0.1;
    player_vel = player_last;
  }
  if (player_speed > 1)
    player_speed = 1;
  if (player_speed < 0)
    player_speed = 0;
```

So now that we have the character's speed and direction (which we'll normalize), we can go ahead and actually move the character in relation to the amount of time that has passed.

```c
  vec3f_normalize(&player_vel);
  vec3f_scale(&player_vel, player_speed);
  player_last = player_vel;
  player_pos.x += 0.001 * time_delta * player_vel.x;
  player_pos.y += 0.001 * time_delta * player_vel.y;
  player_pos.z += 0.001 * time_delta * player_vel.z;
}
```

That wasn't so bad!  It just took some awareness of smooth movement and simplifying player input.  There are probably a thousand ways to achieve the same result we achieved here, but this is certainly a functional method.  So at this point, you can move a character based on its heading and input from the player.

Just because, here is some code for actually rotating the character around the y-axis using the mouse:

```c
void input(short event, char key)
{
  ...
  if (event == EVENT_MOUSEMOVE) {
    player_rot.y += event.motion.xrel * -0.01;
    if (player_rot.y >= M_TAU)
      player_rot.y -= M_TAU;
    if (player_rot.y < 0)
      player_rot.y += M_TAU;
  }
  ...
}
```

Hopefully your characters are a bit more smooth to interact with now.
