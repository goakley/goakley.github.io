---
layout: post
title:  "This Person Doesn't Understand Pointers"
date:   2013-11-16
---

I have yet to see a satisfying explanation as to how Linus Torvalds was able to demonstrate that people [don't understand pointers](http://meta.slashdot.org/story/12/10/11/0030249/linus-torvalds-answers-your-questions).  For those of you who don't like searching through large chunks of text (or who don't like clicking links), Linus bemoans how he wishes more people understood really low-level coding (something I think many of us sympathize with), and demonstrates the following as a way to delete a singly linked list entry:

```
*pp = entry->next;
```

For reference, this his how he has seen 'people' do it:

```
if (prev)
  prev->next = entry->next;
else
  list_head = entry->next;
```

Now one line of code for this looks pretty magical, but it seems to make absolutely no sense out of context of an actual node removal function.  So, let's make one!  Actually, let's make two.  Let's do the "babby's first list" version first, so that everyone is on the same page:

```
void remove_elem(int value, linkedlist **p_list_head)
{ // removes an element from a list by its value
  linkedlist *entry = *p_list_head; // starting at the head of the list...
  linkedlist *prev = NULL; // which has no previous element...
  while (entry) { // while we have a non-null entry (not the end of the list)...
    if (entry->value == value) { // if this node needs to be removed...
      if (prev) // if there was a previous node (this is not the head)...
        prev->next = entry->next; // have the previous node point to the node after this...
      else // otherwise if this node is the head...
        *p_list_head = entry->next; // replace the head of the list with the following node...
    } else { // otherwise if this entry does not need to be removed...
      prev = entry; // mark this entry as 'previous'...
    }
    entry = entry->next; // and move to the next entry
  }
}
```

First of all, this may already be a little too 'pointery' for developers.  The reason for accepting a pointer to the head of a list instead of just the head of the list is so that if the entry to be removed is the head, the reference to the list can be replaced (otherwise we couldn't remove the head of the list).  Note that this code requires us to keep track of the previous and current entry; keeping track of the previous entry means having that extra 'else' check for setting the previous value when the entry does not need to be removed.

This removal method is all well and good and reliable, but something about it just seems a bit... *thick*.  Perhaps a bit long for just removing an element from a list.  Let's try to create a function using Linus's magic line:

```
void remove_elem(int value, linkedlist **p_list_head)
{ // removes an element by its value
  linkedlist **pp = p_list_head; // starting at the head of the list...
  while (*pp) { // while we have a non-null entry (not the end of the list)...
    if ((*pp)->value == value) // if this node needs to be removed...
      *pp = (*pp)->next; // have the list skip this entry...
    else // otherwise if this entry does not need to be removed...
      pp = &((*pp)->next); // move to the next entry
  }
}
```

...Right.  Maybe this needs a little more commenting.

```
void remove_elem(int value, linkedlist **p_list_head)
{ // removes an element by its value
  // we'll use a pointer-pointer to keep track of the address of the current node in the list traversal
  // pp is a pointer to the address of the current node in the list traversal
  // not a pointer to the current node, but a pointer to the address of the current node
  // the previous line was important; read it again
  // we start with the head of the list, of course
  // fortunately we were passed in a pointer to the address of the head of the list already
  linkedlist **pp = p_list_head;
  // by dereferencing pp, we get the address of the current node in the list
  // if this is NULL, that means there is no current node (the address of the current node is nothing)
  // that means we passed the end of the list, so we really should stop
  while (*pp) {
    // again dereferencing pp, we check if the value of the current node is the removal value
    // remember, *pp == &current_node, so *pp->value == current_node.value
    if ((*pp)->value == value)
      // we know that we no longer need the current node
      // the current node is located at *pp (that is its address)
      // *pp right now points to the current node (you have to understand that by now)
      // we're going to have it point to the next node, since we no longer want the current node
      // the next node is of course obtained by dereferencing pp, allowing access to the current node's members
      // since next is a pointer to a new node, we can directly assign it to *pp
      // this replaces the address held by pp with the address of the 'next' node
      // the address that originally held 'this' node now holds the 'next' node; 'this' node is removed
      *pp = (*pp)->next;
    // I think we all know what else does
    else
      // we can increment the list by having pp track the address of the next node in the list
      // that next node becomes the current node this way
      // read this as pp = the address of the node after the node at the address pointed to by pp
      pp = &((*pp)->next);
  }
}
```

Now look at that!  Heck, we not only removed a variable, but dropped from two to one [branching statements](http://stackoverflow.com/questions/11227809/), and we could remove a line by renaming the argument `p_list_head` straight to `pp`.

I suppose by this point you've figured out if you understand pointers or not.  Actually, by this point, you probably understand pointers, not because what I typed made any sense but because you probably left in frustration a long time ago otherwise.

Anyway, this implementation has a whole bunch of caveats, for instance if the list was dynamically allocated then we just lost a reference to a piece of memory we were supposed to free (oops), but it's simple enough to add those details into either implementation (not done here for clarity).

I wrote up a basically functional version of this explanation here:

[https://gist.github.com/goakley/4599351](https://gist.github.com/goakley/4599351)
