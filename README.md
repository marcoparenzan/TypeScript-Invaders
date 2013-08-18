TypeScript-Invaders
===================

My first exercise with TypeScript creating a Space Invaders-like Web Game.

2013.02.21
----------
I have reimplemented my original game structure (the 730 Attack! way, http://www.730attack.it/) ), in a cleaner way.
Game Loop is correct and complete. Enemies, bullets and bonuses have their own collections.
Collisions are detected in the right place (update of specific sprite).
Have to implement collision algorithm (distance from centers of bounding circles)
And performances.
Pay attention to "this"!!!!!! in forEach, this change scope!!!!

2013.02.28
----------
Collision are working. So score is appeared and start destroying enemies. Many enemies: red, green, blue, yellow, cyan and pink.
Game loop is working. So it's ok.

2013.08.18
----------
Major refactoring. Better structure, better manteinance. Updated to Typescript 0.9.1.

