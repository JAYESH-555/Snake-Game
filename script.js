
document.addEventListener("DOMContentLoaded", () => {
    const gameArena = document.getElementById("game-arena");
    const arenaSize = 500;
    const cellSize = 20;
    let score = 0;
    let gameStarted = false;
    let food = {x:300, y:200};
    let snake = [{x:160, y:200}, {x:140, y:200}, {x:120, y:200}];
    let dx = cellSize; //Displacement on x-axis.
    let dy = 0; //Displacement on y-axis.
    let gameSpeed = 200;
    let intervalId;


    
    const backgroundMusic = new Audio("./assets/bg-music.mp3");
    backgroundMusic.loop = true; // Loop the music

    function drawDiv(x, y, className){
        const div = document.createElement("div");
        div.classList.add(className);
        div.style.top = `${y}px`;
        div.style.left = `${x}px`;
        return div;
    }


    function drawFoodAndSnake(){
        gameArena.innerHTML = ''; 

        snake.forEach((snakeCell) => {
            const element = drawDiv(snakeCell.x, snakeCell.y, 'snake');
            gameArena.appendChild(element);
        });

        const foodElement = drawDiv(food.x, food.y, 'food');
        foodElement.innerText = "🐸";
        foodElement.style.fontSize = "20px";
        gameArena.appendChild(foodElement);
    }


    function drawScoreBoard(){
        const scoreBoard = document.getElementById('score-board');
        scoreBoard.textContent = `Score : ${score}`;
    }


    function moveFood(){
        let newX, newY;
        
        do{
            newX = Math.floor(Math.random() * ((arenaSize - cellSize)/cellSize))*cellSize;
            newY = Math.floor(Math.random() * ((arenaSize - cellSize)/cellSize))*cellSize;
        }while(snake.some(snakeCell => snakeCell.x === newX && snakeCell.y === newY));

        food = {x : newX, y : newY};
    }


    function updateSnake(){
        const newHead = {x: snake[0].x + dx, y:snake[0].y + dy};
        snake.unshift(newHead); //Adds the new head
        if(newHead.x === food.x && newHead.y === food.y){
            const audio = new Audio("./assets/music_food.mp3");
            audio.play();
            score += 5;
            //Don't pop the tail but increase the snake
            if(gameSpeed > 30){
                gameSpeed -= 10;
                clearInterval(intervalId);
                gameLoop();
            }
            // Move the food
            moveFood();
        }else{
            snake.pop(); //Remove the last cell
        } 
    }

    function isGameOver(){
        // Check snake body hit
        for(i = 1; i < snake.length; i++){
            if(snake[0].x === snake[i].x && snake[0].y === snake[i].y){
                return true; //Snake collided with its body and Game over.
            } 
        }

        // check wall collision
        const isHittingLeftWall = snake[0].x < 0;
        const isHittingTopWall = snake[0].y < 0;
        const isHittingRightWall = snake[0].x >= arenaSize;
        const isHittingDownWall = snake[0].y >= arenaSize;

        return isHittingDownWall || isHittingLeftWall || isHittingRightWall || isHittingTopWall; // game over
    }


    function gameOver(){
            
        const audio = new Audio("./assets/gameOverSound.mp3");
        audio.play();
    
        
        gameArena.classList.add("shake");

        
        const snakes = document.querySelectorAll(".snake");
        snakes.forEach((snake) => {
            snake.style.backgroundColor = "red";
        });

        
        setTimeout(() => {
            gameArena.classList.remove("shake");
        }, 1000);
    
        
        setTimeout(() => {
            alert(`GAME OVER, Your Score : ${score}`);
            window.location.reload();
        }, 1500); 
    }


    // Every second we will re-render or draw elements to run continuosly.
    function gameLoop(){
        intervalId = setInterval(() => {
            if(!gameStarted) return;
            // Check for Game Over condition
            if(isGameOver()){
                gameStarted = false;

                
                backgroundMusic.pause();
                backgroundMusic.currentTime = 0;

                clearInterval(intervalId); // Stop the game loop
                gameOver(); // Call gameOver function
                return;
            }
            updateSnake();
            drawScoreBoard();
            drawFoodAndSnake();
        }, gameSpeed);
    }


    function changeDirection(event){
        event.preventDefault();
        const LEFT_KEY = 37; 
        const RIGHT_KEY = 39; 
        const UP_KEY = 38; 
        const DOWN_KEY = 40; 

        const keyPressed = event.keyCode;

        const isGoingUp = dy == -cellSize;
        const isGoingDown = dy == cellSize;
        const isGoingLeft = dx == -cellSize;
        const isGoingRight = dx == cellSize;

        if(keyPressed == LEFT_KEY && !isGoingRight) {dy = 0; dx = -cellSize}

        if(keyPressed == RIGHT_KEY && !isGoingLeft) {dy = 0; dx = cellSize}

        if(keyPressed == UP_KEY && !isGoingDown) {dy = -cellSize; dx = 0}

        if(keyPressed == DOWN_KEY && !isGoingUp) {dy = cellSize; dx = 0}
    }

    function runGame(){
        if(!gameStarted){
            gameStarted = true;
            backgroundMusic.play();
            gameLoop();
            document.addEventListener('keydown', changeDirection);
        } 
    }



    function initiateGame(){
        // Creating Scoreboard element with JS
        const scoreBoard = document.createElement("div");
        scoreBoard.id = 'score-board';
        document.body.insertBefore(scoreBoard, gameArena);


        // Creating Scoreboard element with JS
        const startButton = document.createElement("button");
        startButton.textContent = "Start Game";
        startButton.classList.add("start-button");
        document.body.appendChild(startButton);

        // When button is pressed, the game will start
        startButton.addEventListener('click', () => {
            startButton.style.display = 'none';
            runGame();
        });
    }


    initiateGame();//This is the 1st function to be executed so that we prepare the UI
});