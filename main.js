var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

function random(min, max){
    var num = Math.random()*(max - min) + min;
    return num;
}

function Ball(x, y, velX, velY, color, size){
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
}
Ball.prototype.draw = function(){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}
Ball.prototype.update = function(){
    //碰撞检测
    if ((this.x + this.size) >= width||(this.x + this.size)<=0){
        this.velX *= -1;
    }
    if ((this.y + this.size) >= height||(this.y + this.size)<=0){
        this.velY *= -1;
    }
    //位置更新
    this.x += this.velX;
    this.y += this.velY;
}













var balls = [];
var inExchange = [];
BallNumber = 15;
maxSpeed = 8;
minSpeed = 2;
avgSpeed = (maxSpeed + minSpeed)/2;
minSize = 18;
maxSize = 20;
avgSize = (minSize + maxSize)/2;
for (var i = 0; i < BallNumber; i++){
    for (var j = i+1; j < BallNumber; j++){
        inExchange[i*BallNumber + j] = false;
    }
}












function collisionDetect(balls){

    for (var i = 0; i < balls.length; i++){
        for (var j = i+1; j < balls.length; j++){
            dx = (balls[i].x-balls[j].x);
            dy = (balls[i].y-balls[j].y);
            distance  = Math.sqrt(dx * dx + dy * dy);
            intersect = balls[i].size + balls[j].size - distance;
            sin = (dy/distance); cos = (dx/distance);
            if (intersect > 0){
                if (!inExchange[i*BallNumber+j]){
                    /*temp = balls[i].velX; balls[i].velX = balls[j].velX; balls[j].velX = temp;
                    temp = balls[i].velY; balls[i].velY = balls[j].velY; balls[j].velY = temp;*/  
                    
                    vel_centre_i = -balls[i].velX * cos - balls[i].velY * sin; 
                    vel_centre_j = balls[j].velX * cos + balls[j].velY * sin; 
                    vel_centre_i_x = -vel_centre_i * cos; vel_centre_i_y = -vel_centre_i * sin;
                    vel_centre_j_x = vel_centre_j * cos; vel_centre_j_y = vel_centre_j * sin;
                    balls[i].velX += (vel_centre_j_x - vel_centre_i_x); balls[i].velY += (vel_centre_j_y - vel_centre_i_y);
                    balls[j].velX += (vel_centre_i_x - vel_centre_j_x); balls[j].velY += (vel_centre_i_y - vel_centre_j_y);


                    inExchange[i*BallNumber+j] = true;
                }

                
            }else{
                inExchange[i*BallNumber+j] = false;
            }
        }
    }
}

function collisionWithAny(x, y, size, balls){

    for (var i = 0; i < balls.length; i++){
        dx = (x-balls[i].x);
        dy = (y-balls[i].y);
        distance  = Math.sqrt(dx * dx + dy * dy);
        if (distance < size + balls[i].size){
            return true;
        }
    }
    return false;
}











function loop(){

    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, width, height);
    while (balls.length < BallNumber){
        size = random(minSize, maxSize);
        do{
            posX = random(size, width - size); posY = random(size, height - size);
           
        }while(collisionWithAny(posX, posY, size, balls));
        do{
            velX = random(-maxSpeed, maxSpeed);
        }while(velX * velX < minSpeed * minSpeed);
        do{
            velY = random(-maxSpeed, maxSpeed);
        }while(velY * velY < minSpeed * minSpeed);
        var ball = new Ball(
            posX,
            posY,
            velX,
            velY,
            "rgb(" + Math.floor(random(0,256)) + "," + Math.floor(random(0,256)) + "," + Math.floor(random(0,256)) + ")", size
        );
        balls.push(ball);
    }

    for (var i = 0; i < balls.length; i++){
        balls[i].draw();
        balls[i].update();
        
    }
    collisionDetect(balls);

    requestAnimationFrame(loop);
}

loop();