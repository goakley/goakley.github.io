#!/bin/bash

FILES=`ls -1 *.aiff`
for file in $FILES; do
	ffmpeg -i $file ${file%.*}.mp3
done
