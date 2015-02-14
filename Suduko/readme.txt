How to run the app:-
 
 Suduko Game App is easy to play using this website. When you go to this website I have deployed this html in my cloud box(http://107.170.213.24:8080/suduko.html)
 
 Functionality:-
  1. Level selection :-
     Suduko game app has three different levels(Easy, Medium and Difficult). By default this application will select the "Easy" level.
Suppose you left this application in the middle of the game, this app stores the current state of the game in local storage and It retrieves the same state from 
local storage, whern the user comes back.

  2. Validate Board:-
    You can verify the results by using this option. This app will show the result once your trigger this button.The result will be shown on the top of the board.
  
  3. On fly Validation:-
      Suduko App will validate the input whenever the user tries to enter some data. If it is not a valid data ie..If the user enters some texts, It will show 
	  the errror message in red color inside the cell.If the user enters the valid number but It doesn't satisfy the suduko constraint(row level,colum level and box level)
	  then It will show the whole row or column or box in red color.If the user enters the valid amount and It satisfy all the constraints of the suduko game,
	  we will remove the shown errors.
	  
Technical Reasons:-

1. Less.js :-
    It helps in Suduko project to preprocess or pre compile the css and also to write the optimized css.It helps me to reduce the number styles needed for this project.
Currently I am using client side css preprocessor, so less.js needs to be loaded in the client. Currently It takes approximately 70ms to generate the css file.In future, we can
do server side preprocess and we get the css file or css file url in the response itself.
	
2. Handlebar.js:-
   Suduko has totally 81 cells, in the html, If we create 81 cells, It becomes complicated to do some modifications in the future. So I am using handlerbar template. By using this
templating engine, I have created the board template in short time and It emits the HTML based on the given input. Currently I am doing this templating in client side and infuture we can move this templating engine to server
side and It will convert the template into a .js file and we can inject this js in our page and we can pass data in client side and It will render the html in
client side itself.

3.Jquery:-
  Most widely used framework and It reduces the javascript lines of code and reduces the code complexity.

Trade-off and Future enhancements:-

1.Game generation:-
   Game generation part can be done by brute force or backtracking. Brute force can be the easiest way to generate the game , but It will take some time to
   generate the valid game. Backtracking is somewhat better than brute force and It is complex to code and It provides some good performance than brute force.
   
   Game generation is taking input as level. So while generating the game, based on the level app needs to provide the givens, ie..what are the open cells in the
   board.One basic idea is, we can decide number of givens based on the level.   
   Ideally Game generation should be done by webworkers ie. If you have 4 different levels, we can start 4 different webworkers to figure out the valid game 
   data based on the level.   
  
2.Score Calculation:-
  Once the user starts the game, we can start the timer and we can show the score based on the time the user takes and the current level.
  
3. More options to user:-
  Currently I am saving the date whenever user enters the valid data in the local storage. We can explicitly provide one option like "Save Game" , 
  so that we can save the current state and time and we can  show the same state , when user comes back.  
  
4. We can integrate with social websites like facebook, twitter to invite friends to play.

5. We can provide multi player game options also.
  
 
