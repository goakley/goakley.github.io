---
layout: post
title:  "Code Jam Input With Haskell"
date:   2014-02-27
---

Functional programming provides such an elegant system for processing data.  I'm going to stop right there before I start fanboying.  Haskell deals with the impurity of I/O by providing monads, which is further simplified through the `interact` function, which takes a function that takes a string and returns a string.  The input string comes from stdin and the output string comes from stdout.

```
interact :: (String -> String) -> IO ()
```

That's all well and good for simple input, like a CSV file, but when you have some complicated sequences of meaningful input, how do you manage?

Enter the [Google Code Jam](http://code.google.com/codejam/) problems.  These are simple (or not-so-simple) algorithmic challenges perfectly suited to functionl programming... except for the input and output.  I will be using this blog post to demonstrate the use of the `interact` function on different input cases for Google Code Jam problems.  When reading the code explanations, read the comments from the bottom of the function to the top; it's easier to see how the input string is processed that way.

# [2010 - Round 1B - A. File Fix-it](http://code.google.com/codejam/contest/635101/dashboard#s=p0)

## Input

```
3
0 2
/home/gcj/finals
/home/gcj/quals
2 1
/chicken
/chicken/egg
/chicken
1 3
/a
/a/b
/a/c
/b/b
```

## Output

```
Case #1: 4
Case #2: 0
Case #3: 4
```

## Solution Signature & Main

```
diffDirectories :: ([String],[String]) -> Int

main = interact $ unlines .
       -- we need a method of attaching the case number to each result
       zipWith (++) ["Case #" ++ show i ++ ": " | i <- [1..]] .
       -- we can now execute the solver `diffDirectories` on the pairs of directories
       map ((show . diffDirectories) .
            -- we split the test case directories into the existing and new directories
            (\a -> splitAt (read (head (words (head a)))) (tail a))) .
       -- we need to seperate each test case to processes them individually
       groupBy (\_ b -> head b == '/') .
       -- we don't care much for the first line; we can calulate the number of cases
       tail . lines
```

# [2014 - Round 1B - A. The Repeater](http://code.google.com/codejam/contest/2994486/dashboard#s=p0)

## Input

```
5
2
mmaw
maw
2
gcj
cj
3
aaabbb
ab
aabb
2
abc
abc
3
aabc
abbc
abcc
```

## Output

```
Case #1: 1
Case #2: Fegla Won
Case #3: 4
Case #4: 0
Case #5: 3
```

## Solution Signature & Main

```
solution :: [String] -> Maybe Int

main = interact $ unlines .
       zipWith (++) ["Case #" ++ show i ++ ": " | i <- [1..]] .
       -- the solver will return Nothing if Fegla won
       -- otherwise the result can just be displayed
       map ((maybe "Fegla Won" show . solution) . tail) .
       -- group together all strings for each test case
       groupBy (\_ b -> head b `elem` ['a'..'z']) . tail . lines
```

Keep an eye on this post for potential updated test cases.
