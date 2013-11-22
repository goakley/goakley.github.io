---
layout: post
title:  "Don't Be Like Uninitialized Variable Group"
date:   2013-11-11
---

Now, let me preferece this by saying that I appreciate the efforts of [my department](http://computerscience.pages.tcnj.edu/) to modernize our curriculum by adding topics such as logging, multiple languages, and a larger focus on diagramming.  I said I appreciate the efforts, not the result.  Waching the professors cram all this information into already established courses is a bit painful, especially for the students, which I think have a hard enough time getting motivated.

As part of my recent massive procrastination binge (Russian film is great, but not entire-paper-on-a-single-film great), I opted to spend yesterday in the Mac lab, because nothing will distract you from your own work like sophomores who have no idea how to turn UML diagrams into actual code.  To make this even more entertaining, the course they are in is incorporating code written by past students, as part of a 'students need to learn how to read other people's code' adventure.  Now, this code was written by other students.  Other sophomoes.  You can imagine how well-tested and self-commenting the code is (answer: suprisingly well done for sophomores).  The code even worked!

I mean, it worked last semester, it didn't work now.  And nothing confuses new developers like 'Segmentation Fault'.  So after a few minutes of screaming internally I slid my chair over and joined the fray.  And lo and behold, as much as they were encouraged to, the students had not looked at any debugging tools.  Which is very disheartening, because there is no way to work proper debugging into the curriculum (see above), and students just can't seem to explore these things on their own.

10 minutes of [gdb](http://www.gnu.org/software/gdb/documentation/) magic should have certainly changed their view.  Having them watch as all I did was run `gdb ./driver`, `run`, and watch it crash with an explanation of the line number must have been quite a learning experience, I think they thought it was magic.  There was a simple uninitialized variable bug, a one line fix.  They had been there for two hours.

It always saddens me when people won't learn beyond what must to get the job done.  There is measurable value in learning debugging, unit testing, lint checks, and the like.  These 'extras' are not designed for super-advanced gurus only; if anything, they can help new developers identify problems that they have little to no experience with, that would otherwise be undiagnosed (or in this case, diagnosed by staring at the code and changing lines individually and hoping thing are fixed).

So, don't be like Uninitialized Variable Group.  [Learn to debug](http://www.cprogramming.com/gdbtutorial.html).
