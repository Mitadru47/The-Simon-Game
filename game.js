// KeyLogs - #1 & #2 have been commented to prevent cheating using Dev Tools.

var level = "Level ";
var levelCount = 0;

var gamePattern = [];
var userClickedPattern = [];

var buttonColors = ["red", "blue", "green", "yellow"];

var keyPressCount = 0;
var inGameKeyPressCount = 0;

// All Functions|Event-Listeners are in order of execution - top to bottom.

// #1 - Game begins when a keyboard key is pressed.
$(document).keypress(function (){

    keyPressCount++;
    
    // To keep track of Key-Presses.
    // First Key-Press will Start the Game | nextSequence() should be called only once for the first Key-Press.

    if(keyPressCount == 1){         
     
        $("h1").text("Level " + levelCount);
        nextSequence();
    }
});

// #2 - Sequence Generator
function nextSequence(){

    levelCount++;
    $("h1").text("Level " + levelCount);

    var randomNumber = Math.floor(Math.random() * 4);     //Range: 0-3
    var randomChosenColor = buttonColors[randomNumber];

    gamePattern.push(randomChosenColor);

    $("div." + randomChosenColor).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    playAudio(randomChosenColor);

    // Resetting User Input Trackers to account for extra Out-of-Game Inputs i.e. After previous Failed Game - If Any.

    inGameKeyPressCount = 0;
    userClickedPattern = [];
}

// #3 - Audio Player
function playAudio(keyword){

    var audio = new Audio("sounds/" + keyword + ".mp3");
    audio.play();
}

// #4 - User | Game Inputs
$("div.btn").click(function (event){

    inGameKeyPressCount++;

    var userChosenColor = event.target.id;
    userClickedPattern.push(userChosenColor);

    animatePress(userChosenColor);
    playAudio(userChosenColor);

    // KeyLog #1
    console.log(inGameKeyPressCount + " " + levelCount);

    // checkAnswer() is only called when user has finished giving inputs which is defined by:

    // when number of user inputs is equal to the number of random colors generated i.e.
    // userClickedPattern.length is equal to gamePattern.length

    // Also Note: gamePattern.length is equal to levelCount

    if(inGameKeyPressCount === levelCount){
     
        inGameKeyPressCount = 0;
        checkAnswer(userClickedPattern.length - 1);
    }
});

// #5 - KeyPress Animator
function animatePress(currentColor){

    $("div." + currentColor).addClass("pressed");

    setTimeout(function (){ 

        $("div." + currentColor).removeClass("pressed"); 
    }, 100);
}

// #6 - Results are checked at the end of each level after the user has given their inputs.
function checkAnswer(currentLevel){
   
    // KeyLog #2
    console.log(userClickedPattern + "  " + gamePattern);

    var flag = 0;

    // Verifying Complete Sequence Integrity.
    for(var i = 0; i<=currentLevel; i++){

        if(userClickedPattern[i] !== gamePattern[i]){
         
            flag = 1;
            break;
        }
    }

    if(flag === 0){
        
        console.log("Success");

        // Scraping userClickedPattern to capture User Inputs from scratch for the Next Level.
        userClickedPattern = [];

        // nextSequence() is called again when Level is cleared i.e. Verification is Successful. 
        setTimeout(nextSequence(), 1000);
    }

    else{
     
        console.log("Failure");

        // Game Over - Audio 
        
        var failureAudio = new Audio("sounds/wrong.mp3");
        failureAudio.play();

        // Game Over - Background
        
        $("body").addClass("game-over");

        setTimeout(function (){ 

            $("body").removeClass("game-over"); 
        }, 200);

        // Game Over - Header
        $("h1").text("Game Over! Press Any Key to Restart");

        startOver();
    }
}

// #7 - Reset | After Failure
function startOver(){

    level = "Level ";
    levelCount = 0;

    gamePattern = [];
    userClickedPattern = [];

    keyPressCount = 0;
    inGameKeyPressCount = 0;

    // Next KeyPress will trigger all the above Functions|Event-Listeners in their respective orders.
}