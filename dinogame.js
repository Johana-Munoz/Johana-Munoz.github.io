console.log("hello dino");

//image dimentions:
//1233x68
//
//Global variable


var image = new Image();
var canvas = document.getElementById('dino_game');
var ctx = canvas.getContext('2d');
var ground_pos = 0;
var dino_jump = false;
var dino_running = 0;
var dino_ducking = false;
var jump_height = 0;
var jump_velocity = 0;
var gravity = 0.2;
var jump_force = 6;
var moon_phase = 0;
var moon_x = 300;
var stars_y= [40,60,110];
var stars_x = [200,300,500];
var cloud_y = [45,70,90];
var cloud_x = [100,500,600];
var score = 0;
var highscore = 0; 
var speed = 5;
//getting from our png
var obstacle_offset_x = [136,181,226,246,279,329,358,408];
var obstacle_width = [45,45,20,33,50,29,50,73];
//placing on the game
var obstacle_top = [144,144];
var obstacle_x = [-10,-50];
var current_obstacle = [7,3];
var bird_flap = [0,0];
var start_game = false;


main();

function start_new_game(){
    if (highscore < score) highscore = score;
    score = 0;
    speed = 5;
    obstacle_x = [-10,-50];
}

function draw_obstacle(){
    for (var i = 0; i < current_obstacle.length; i ++){
        
        obstacle_x[i] -= speed;
        bird_flap[i] ++;
        
        if(bird_flap[i] % 10 == 0 && current_obstacle[i] < 2 ) {   
           if (current_obstacle[i] == 0 ) current_obstacle[i] = 1;
           else current_obstacle[i] = 0;
            
        }
           
        if (obstacle_x [i] < -75 ) {
            obstacle_x [i] = canvas.width + 50 + Math.random() * 1000; 
            current_obstacle[i] = Math.floor(Math.random() * obstacle_offset_x.length);
            
         
            if (Math.abs(current_obstacle[0] - current_obstacle[1]) < 200) {
                obstacle_x[i] += 400;
                
            }
          
            if (current_obstacle[i] < 2) {
                obstacle_top[i] = 144 - Math.random () * 100;
            }
            
            else if (current_obstacle[i] < 5) {
                obstacle_top[i] =154;
            }
            
            else{
                obstacle_top[i] = 144;
            } 
        } 
        
        ctx.drawImage(image, obstacle_offset_x[current_obstacle[i]], 0, // source x,y
            obstacle_width[current_obstacle[i]], 50, // source w,h
            obstacle_x[i], obstacle_top[i], // destination x,y 
            obstacle_width[current_obstacle[i]], 50); // destination w,h  

    }
}

function main (){
    setup_canvas();
    draw_intro();
    document.onkeydown = keydown;
    document.onkeyup = keyup;
    
    var interval = setInterval(update,10);
}

function world_changes(){
    speed = 5 + score / 100;
    if (speed > 12) speed = 12;
}

function collision(){
    for (var i = 0; i < current_obstacle.length; i ++){
        if (Math.abs(obstacle_x[i]-90) < 10) {
         
            if (current_obstacle[i] < 2 && dino_ducking){
                return false;
            }
            if (144-jump_height + 50 > obstacle_top[i]){
                return true;
            }
        }
    }
    return false;
}

function display_game_over(){
    ctx.drawImage(image,654,15,// source x,y
                195,15, // source w,h
                150,50, // destination x,y 
                195,15); // destination w,h
    ctx.drawImage(image,0,0,// source x,y
                40,40, // source w,h
                225,70, // destination x,y 
                40,40); // destination w,h

}

function update(){
    if(start_game == false) return;
    if(collision()){
       display_game_over();
       return;
    }   
    erase_canvas();
    scroll_ground();
    dino_run();
    dino_jumping();
    draw_moon();
    draw_stars();
    draw_clouds();
    score ++;
    draw_score();
    draw_obstacle();
    world_changes();
}

function draw_digit(n, pos_x){
    ctx.drawImage(image,654 + n * 10, 0,// source x,y
                    10,15, // source w,h
                    pos_x, 50, // destination x,y 
                    10, 15); // destination w,h

        
    }
  
function draw_number(num, pos_x){
    //125
    draw_digit(num % 10, pos_x);
    pos_x -= 10;
    draw_digit(Math.floor((num/ 10)) % 10, pos_x);
    pos_x -= 10;
    draw_digit(Math.floor((num/ 100)) % 10, pos_x);
    pos_x -= 10;
    draw_digit(Math.floor((num/ 1000)) % 10, pos_x);
    pos_x -=10;
    draw_digit(Math.floor((num/ 10000)) % 10, pos_x);
    
    //125 / 10 = 12 R S
    //376 / 10 = 37 R 6
    
}

function draw_score(){
    draw_number(Math.floor(score / 10), canvas.width - 15);
    draw_number(Math.floor(highscore / 10), canvas.width - 75);
   //hi
   ctx.drawImage(image, 654 + 10 * 10,0, //source x, y
                   20, 15, //source w,h
                   canvas.width - 145, 50, //destination x,y
                   20, 15); //destination w,h
}

function draw_clouds(){
   
    for (var i = 0; i < cloud_x.length; i ++){
        ctx.drawImage(image,90,0,// source x,y
                    45,50, // source w,h
                    cloud_x[i],cloud_y[i], // destination x,y 
                    45,50); // destination w,h

         cloud_x[i] = cloud_x[i]-0.35;
        
         if (cloud_x[i]<-80){
             cloud_x[i] = canvas.width +10+Math.random()*20-10;
             cloud_y[i] = Math.random()*70+40;  
         }
    }
  
}
    
function draw_moon(){
    var phase_x = [482,504,524,545,585,606,622];
    var phase_width = [22,19,19,38,19,16,20];
    ctx.drawImage(image,phase_x[moon_phase],0, // source x,y
        phase_width[moon_phase],50, // source w,h
        moon_x,50, // destination x,y 
        phase_width[moon_phase],50,); // destination w,h
    moon_x = moon_x - 0.1;

    if (moon_x < -80){
         moon_phase = Math.floor(Math.random() * phase_width.length);
         moon_x = canvas.width +10;
         }
    }  

function draw_stars(){
   
    for (var i = 0; i < stars_x.length; i ++){
        ctx.drawImage(image,645,2 + i * 9, // source x,y
                    7,9, // source w,h
                    stars_x[i],stars_y[i], // destination x,y 
                    7,9,); // destination w,h

         stars_x[i] = stars_y[i]-0.15;
         if (stars_x[i]<-80){
             stars_x[i] = canvas.width +10+Math.random()*20-10;
             stars_y[i] = Math.random()*70+40;  
         }
    }
  
}

function dino_jumping(){
   jump_velocity = jump_velocity - gravity;
   jump_height = jump_height + jump_velocity;
      
   if (jump_height < 0) jump_height = 0;
  }


function setup_canvas(){
    canvas.width = 500;
    canvas.height = 200;
}

function erase_canvas(){
   ctx.clearRect(0,0,1000,200); 
}

function keyup(evt){
    dino_ducking = false;
}


function keydown(evt){
    console.log(evt);
    dino_ducking = false;
    
    if (collision()){
        start_new_game();
        return;
    }
    
    if(evt.key == " "){
        start_game = true;
    }
    
    if(evt.key == "ArrowDown"){
        jump_height = 0;
        dino_ducking = true;
    }
    if (evt.key == "ArrowUp" &&jump_height == 0){
        jump_velocity = jump_force;
    }
}


function draw_intro(){
    image.src = 'sprite.png';
    
    offset_x = 20;
    offset_y = 0;
    
    image.onload = function(){
        ctx.drawImage(image,
            40,0,    //Souce x,y
            45,50,  // source w,h
            offset_x, offset_y, //desination x,y
            45,50); //desination w,h
    }
    ctx.font = "20px Arial";
    ctx.fillText("Press space to play", offset_x, offset_y + 80);
}

function scroll_ground(){
    
    var ground_width = 1150; //1233
     ctx.drawImage(image,
            5,53,    //Souce x,y
            ground_width,15,  // source w,h
            -ground_pos, 180, //desination x,y
            ground_width,15); //desination
    
     ctx.drawImage(image,
            5,53,    //Souce x,y
            ground_width,15,  // source w,h
            ground_width - ground_pos, 180, //desination x,y
            ground_width,15); //desination
    
    
    ground_pos += speed;
    if(ground_pos >= ground_width) ground_pos = 0;
}

function dino_run(){
    var x_grab = [936, 980];
    var x_grab_ducking = [1169, 1110];
    
    dino_running = dino_running + 0.1;
    
    if(dino_ducking == true) {
       jump_height = 0;
       ctx.drawImage(image,
                     
         x_grab_ducking[Math.floor(dino_running) % 2], 0,     //Souce x,y
         63,50,  // source w,h
         45, 144-jump_height, //desination x,y
         63,50); //desination
                 
    }
    
    else if (jump_height>0){
      ctx.drawImage(image,
         846, 0,     //Souce x,y
         45,50,  // source w,h
         45, 144-jump_height, //desination x,y
         45,50); //desination   
    }
    else{
        ctx.drawImage(image,
         x_grab[Math.floor(dino_running) % 2], 0,     //Souce x,y
         45,50,  // source w,h
         45, 144-jump_height, //desination x,y
         45,50); //desination
    }

}