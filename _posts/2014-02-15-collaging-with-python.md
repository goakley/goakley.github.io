---
layout: post
title:  "Collaging With Python"
date:   2014-02-15
---

As St. Valentine's Day / H&HD / Lupercalia came to a close yesterday evening, I found myself in need of a collage-producing program, something that would take the images I collected and shove them all into one large image.  A quick perusal of the Arch user repository yielded a couple of programs that seemed promising, but couldn't lay the images out in the type of arrangement I required: simple non-overlapping blocks.

It took me about 5 minutes to realize I had run into the [bin packing problem](http://en.wikipedia.org/wiki/Bin_packing_problem).  Not to be discouraged by such silly terms as "NP-hard", I whipped up an algorithm that would work for my purposes (around 100 images after filtering).

The approach I took is very naive.  Starting with a collage containing only the largest image, select the next largest image and insert it somewhere that will cause the collage's dimensions to grow as little as possible.  There were a few extra conditions I had to add to the problem to make it work with a collage:

* Images were of all different sizes, but more or less were all taken with a camera.  I chose to cap all images at some predefined maximum size (set at 800x600); images larger would be scaled down.
* In order to get a result that wasn't just a row of images, the collage has to be bound to some aspect ratio (I picked 4:3).  Image placements that may break that ratio would have to be placed elsewhere.

The result of sending 100 or so images into the program was the following shape:

![Shape of the resulting collage](/imgs/collage_shape.png)

Absolutely good enough for my purpose, with time to spare!  The fully-commented program can be found here: [https://gist.github.com/goakley/9022997](https://gist.github.com/goakley/9022997)
