// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(1250, 400, Phaser.AUTO, 'game', stateActions);

/*
 * Loads all resources for the game and gives them names.
 */
var score = 0;
var labelScore;
var player = {};
var count;
var width = 790;
var height = 400;
var gameSpeed = 200;
var gameGravity = 200;
var jumpPower = 200;
var music;
//var vid = document.getElementById("Maro_Jump_Sound_Effect");




var startText;

var pipes = [];
var balloons = [];
var weight = []

player.x = 150;
player.y = 200;
//player.body.velocity.x = 100;
//player.body.velocity.y = -100;
//player.body.gravity.y = 100;

function preload() {
    game.load.image("playerImg", "../assets/flappy_man_of_steel.png");
    //game.load.audio("score", "../assets/Maro_Jump_Sound_Effect.ogg");
    game.load.image("pipe","../assets/pipe2-body.png");
    game.load.image("pipeend","../assets/pipe2-end.png")
    game.load.audio("Flappy","../assets/SUPERMAN_THEME_SONG_FLAPPY.ogg");
    game.load.image("ballons","../assets/ballons.png");
    game.load.image("weight","../assets/weight.png");
    game.load.image("background","../assets/Sunset_Wallpaper.png");
   // game.load.image("unmute","../assets/unmute.png");
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    // set the background colour of the scene
    //game.stage.setBackgroundColor("#a7aa80");
    //game.stage.setBackgroundColor("000000");
    var back = game.add.image(0,0,"background");
    back.width = 1300;
    back.height = 400;

    game.add.text(500, 80, "",
        {font: "108px Helvetica", fill: "#000066"});



    game.input
        .onDown
        .add(clickHandler);

    //game.input
    //    .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    //    .onDown.add(spaceHandler);

    //alert(score);

    labelScore = game.add.text(20, 20, "0");

    player = game.add.sprite(100, 200, "playerImg");

    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
        .onDown.add(moveRight);

    game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
        .onDown.add(moveLeft);

    game.input.keyboard.addKey(Phaser.Keyboard.UP)
        .onDown.add(moveUp);

    game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
        .onDown.add(moveDown);

    generate();

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(player);

    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);

    pipeInterval = 1.75;
    game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND,
    generatePipe);

    player.anchor.setTo(0.5, 0.5);

    game.paused = true;








    music = game.sound.play("Flappy", 1, 1, true, false);

    startText= game.add.text(440, 180, "Press SPACE to play");

    //music.setVolume(.05)


}


/*
 * This function updates the scene. It is called for every new frame.
 */




function clickHandler(event) {
    //alert("click!");
    //alert("The position is: " + event.x + "," + event.y);
    //game.add.sprite(event.x, event.y, "playerImg");

}

function changeScore() {
    score = score + 1;
    labelScore.setText(score.toString());
}

function moveRight() {
    player.x = player.x + 20
}

function moveLeft() {
    player.x = player.x - 20
}

function moveUp() {
    player.y = player.y - 20
}

function moveDown() {
    player.y = player.y + 20


}







function generatePipe() {
    ////for(var count=0; count<8; count++){
    ////    game.add.sprite(80, 50 * count, "pipe");
    ////    game.add.sprite(200, 50 * count, "pipe");
    ////}
    ////
    ////for (var count=2; count<10; count = count + 2) {
    ////    game.add.sprite(count * 50, 200, "pipe");
    ////}
    ////
    ////count = 9;
    ////if (count<5) {
    ////    alert("count is smaller than 5!");
    ////}
    ////for(var count=0; count<8; count++) {
    ////    if(count != 4){
    ////        game.add.sprite(0, 50 * count, "pipe");
    ////    }
    ////}
    ////if (count<5) {
    ////    alert("count is smaller than 5!");
    ////}
    ////else if (count==5) { 1
    ////    alert("count is equal to 5!");
    ////}
    ////else if (count==6) { 1
    ////    alert("count is equal to 6!");
    ////}
    ////else {
    ////    alert("count is something else (i.e. greater than 6)");
    //}
    //var gapStart = game.rnd.integerInRange(1, 5);       1
    //for (var count=0; count<8; count=count+1) {   2
    //    if(count != gapStart && count != gapStart + 1) { 3
    //        game.add.sprite(0, count * 50, "pipe");
    //    }


        var gap = game.rnd.integerInRange(1 ,5);
    // generate the pipes, except where the gap should be
    for (var count=0; count<8; count++) {
        if (count < gap || count >= gap+3) {
            addPipeBlock(1250, count*50);
        }
    }




    changeScore();
}

    function addPipeBlock(x, y) {
        var pipeBlock = game.add.sprite(x,y,"pipe");
        pipes.push(pipeBlock);
        game.physics.arcade.enable(pipeBlock);
        pipeBlock.body.velocity.x = -200;



}

    function playerJump() {

        if (game.paused) {
            game.paused = false
            startText.destroy();
        }



        //player.body.velocity.x = 200;
        player.body.velocity.y = -200;
        player.body.gravity.y = 500;
            game.sound.play("score");

    }

function update() {
    for(var index=0; index<pipes.length; index++){
        game.physics.arcade
            .overlap(player,
        pipes[index],
        gameOver);
    }
    if(player.body.y < 0) {
        gameOver();
    }
    if(player.body.y > 400){
        gameOver();
    }
    player.rotation = Math.atan(player.body.velocity.y / 400);
}


function changeGravity(g) {
    gameGravity += g;
    player.body.gravity.y = gameGravity;

}

function generateBalloons(){
    var bonus = game.add.sprite(width, height, "balloons");
    balloons.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = - 200;
    bonus.body.velocity.y = - game.rnd.integerInRange(60,100);

    function generateWeight(){
        var bonus = game.add.sprite(width, height, "weight");
        weight.push(bonus);
        game.physics.arcade.enable(bonus);
        bonus.body.velocity.y = - 200;
        bonus.body.velocity.x = - game.rnd.integerInRange(60,100);
    }
}

function generate() {
    var diceRoll = game.rnd.integerInRange(1, 10);
    if(diceRoll==1) {
        generateBalloons();
    } else if(diceRoll==2) {
        generateWeight();
    } else {
        generatePipe();
    }
}


function gameOver() {
    game.destroy();
    music.stop();
    $("#scorePlace").html(score);
    $("#greeting").show();
    gameGravity = 200;
    score = 0;
}