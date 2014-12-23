# Barricade

See https://en.wikipedia.org/wiki/Malefiz


## To do

* Localstorage with curent game
* Remove views from board UI when models are destroyed
* Load UI on the fly, not as dependency VS useful when packaging
* Create more fun maps and with more players
* When a (real) player passes its turn, check that he is not lazy
* Create a zoomable board: + and - buttons (within controls panel?)
* Add some sounds: player turn, barricade captured, move error, etc.
* Save the current game/user to restore them later
* Multiplayer
* Scores storage (move counts / dice count / barricade captured / player captured)
* Rules with pictures


## Changelog

### 0.6alpha

* Added offline storage for the user settings


### 0.5

* Add a winner/loser panel
* More comprehensive UI
* Add the elements to the document within the view
* Set the turn and dice infos current user only
* Made the notifications talking to the current user
* Color update for player when game restarts
* Migrate the board UI from DOM to CANVAS
* Align the board in the center of the page
* Get rid of background attribute for places


### 0.4

* The design of the control buttons has evolved
* Added a new panel when the game is paused
* Added icons
* The views no longer uses internal data storage
* All the panels are merged into a single one
* The rendering size is set according to the zoom of the browser (except for the board)
* The events dedicated to the panel have better names
* The errors are now thrown to the console


### 0.3

* Made the translation from the settings panel an instantaneous change
* Changed the 2 players map
* The players now have random names
* The user can change its name, color and language
* The game can be reset


### 0.2

* Added a french translation
* Fixed some issues with the AI


### 0.1

* First version of the game
