---
layout: post
title:  "Installing Updates (do not turn off or unplug your computer)"
date:   2013-09-29
---

<i>Installing updates is not the safest action when your computer has a history of dying from power failures stemming from unidentifiable sources; how does one recover from an interrupted update?</i>

Laptop batteries are probably one of the most questionable components of a laptop.  With the exorbitant price of manufacturer batteries, users often settle for off-brand batteries which, more often than not, are a perfectly suitable alternative when the original manufacturer battery is failing.

I, on the other hand, have managed to land a battery that is unable to handle 'heavy' system loads (for some undeterminable definition of heavy that I've narrowed down to 'when I need it to be working') unless it is constantly plugged in.  It took me a while to remember that I shouldn't put my laptop under any strenuous activity while unplugged, and one such learning event occurred while attempting to update [my Linux system](https://www.archlinux.org/).

Such an event is really no big deal.  I've died during updates before.  The package archives should still be there, I can just log into a TTY and re-run the update with force flags, or just find the corrupt files and replace those.  As long as this update didn't happen to include the kernel itself and that specific package didn't happen to be updating at the time of the failure (which involes a rebuild of the ramdisk) then I fail to see how this would be any different.

```
switch_root: failed to execute /sbin/init: Input/output error
[      0.000000] Kernel panic - not syncing: Attempted to kill init!
```

Alright, that's still not a big deal.  I've had 0-byte files cause an I/O error before (not in this exact situation, but still).  Perhaps it had something to do with the fact that [I had changed syslinux to mount the root disk `rw`](https://bbs.archlinux.org/viewtopic.php?pid=1303683#p1303683) since last boot.  Regardless, booting off of a USB would give me access to the system again and allow me to fix this!  Relatedly, I recommend keeping an Altoid tin full of Linuxes (Linuxii) in case of emergency boot issues or emergency Windows-user-convert issues.

Since `init` is owned by systemd (the service manager for my system), I first decided to forcibly reinstall `systemd` and `systemd-sysvcompat`.

```
$ mount /dev/sda1 /mnt
$ pacman -S -r /mnt --force systemd systemd-sysvcompat
$ ls -l /lib/systemd/systemd
-rwxr-xr-x 1 root root 1039792 Sep 19 18:12 /lib/systemd/systemd
```
```
switch_root: failed to execute /sbin/init: Input/output error
[      0.000000] Kernel panic - not syncing: Attempted to kill init!
```

Was the problem just systemd?  How about specifying a different initscript?  I've actually found setting my fallback kernel's init script to `sh` to be entirely useful for quick repairs that don't require key daemons to be running.

```
$ nano /mnt/boot/syslinux/syslinux.cfg
...
LABEL archfallback
...
      APPEND root=/dev/sda1 init=/bin/sh rw
...
```
```
switch_root: failed to execute /bin/sh: Input/output error
[      0.000000] Kernel panic - not syncing: Attempted to kill init!
```

My intuition so far has been incorrect.  Surely the package upgrade logs can shed some light onto what went wrong?  What exactly was happening when my laptop died?
$ cat /var/log/pacman.log
...
[0000-00-00 00:00] [PACMAN] starting full system upgrade[BINARY DATA]
```

Alright, on to check the packages instead.  Maybe something went wrong with the package integrity (if the packages are still even there).

```
$ ls -l /var/cache/pacman/pkg
-rw-r--r-- 1 root root 8611472 Sep 26 13:28 glibc-2.18-5-x86_64.pkg.tar.xz
-rw-r--r-- 1 root root       0 Sep 26 13:28 glm-0.9.4.6-1-any.pkg.tar.xz
-rw-r--r-- 1 root root       0 Sep 26 13:28 lib32-flashplugin-11.2.202.310-1-x86_64.pkg.tar.xz
-rw-r--r-- 1 root root       0 Sep 26 13:28 lib32-glibc-2.18-5-x86_64.pkg.tar.xz
-rwxr-xr-x 1 root root       0 Sep 26 13:28 libdvbpsi-1-1.1.0-1-x86_64.pkg.tar.xz
-rw-r--r-- 1 root root       0 Sep 26 13:28 m4-1.4.17-1-x86_64.pkg.tar.xz
-rw-r--r-- 1 root root       0 Sep 26 13:28 phonon-vlc-0.6.2-2-x86_64.pkg.tar.xz
-rw-r--r-- 1 root root       0 Sep 26 13:28 vlc-2.1.0-2-x86_64.pkg.tar.xz
```

I didn't recall reading about any infinitely-compressible information algorithms, so I was fairly sure that these packages should not be empty.  If I had to guess, I'd say that the system stopped during an I/O operation, which lost information about the files for certain package archives.  The fix of course was a re-download and a force install of the packages, all from a bootable USB.

```
Generating locales...
Floating Point Exception.
```

Generating locales failed with a floating point exception during installation from the USB drive, but maybe I could run it manually and get a better error description while not under `chroot`.  Booting back into /bin/sh and ignoring the plethora of boot warnings and errors did yield a shell.

```
$ locale-gen
Generating locales...
  en_US.UTF-8... done
  ja_JP.UTF-8... done
  ru_RU.UTF-8... done
```

This was indeed the final step in the restoration process, and the next reboot brought me into a working system.

I've since learned how to approximate what sort of actions might make my computer overuse the battery.  I'm certainly never updating on battery again.  I can't be upset about this experience though, because it tested my knowledge of Linux quite well and taught me a few things along the way.  Of course, my computer now also has a hardware problem where one of the DIMM slots will no longer be recognized during operation, causing the ugliest crashes I have ever seen.  Perhaps I should just buy a new laptop, but I feel like that would be admitting defeat.
