# Tic-Tac-Toe 

**Tic-tac-toe web app. [View in browser](https://dryu99.github.io/tic-tac-toe/)** </br>
*From The Odin Project's [curriculum](https://www.theodinproject.com/courses/javascript/lessons/tic-tac-toe-javascript)*
</br>
</br>

**Languages/Technologies/Libraries used:**
- JavaScript
- HTML
- CSS
- jQuery (1st time)
</br>

**Key Learning Highlights:**
- JS modules and factory functions produce more organized code and avoids populating the global namespace
- Function closure allows functions to retain scope even when passed around and called elsewhere 
- jQuery simplifies DOM manipulation and make code much more succint (I love it so much)
- Data representation is tricky 
</br>

**Technical Problems I faced:**
- When making an object's variable publicly accessible in factory functions/modules, modifying that variable through any of the object's functions will NOT affect the value returned from object.var. The variable modified resides "inside" the object, and is only being affected by the function due to function closure. 
  - Faced this problem when I made the game module's "currentPlayer" variable public, and when I tried to modify it via a game function, game.currentPlayer had not changed. Fixed this by making a getter method to retrieve the modified currentPlayer and made it privately accessible. 
- Deciding how to organize my code into distinct areas (i.e. modules/factory functions) of functionality, and choosing which area should contain what kind of tic-tac-toe logic.  
  - Designed 3 modules: one that handled game logic, one that handled game board data, and one that dealt with rendering everything  
  
  
