export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

export const createStage = () => 
    Array.from(Array(STAGE_HEIGHT), () => 
        new Array(STAGE_WIDTH).fill([0, 'clear'])
    );

export const checkCollision = (player, stage, { x: moveX, y:moveY}) => {
    for(let y = 0; y < player.tetromino.length; y ++) {
        for(let x = 0; x < player.tetromino[y].length; x ++) {
            //1 check that we are on a an actual tetromino cell
            if(player.tetromino[y][x] !== 0) {
                if (
                //2. check that our move is inside the game areas height (y)
                //we shouldn't go thorugh bottom of play area
                !stage[y +player.pos.y + moveY] ||  
                // 3. check that out move is inside teh game areas width (x)
                !stage[y + player.pos.y + moveY][x +player.pos.x + moveX] || 
                //4. check that the cell we are moving to is not set to clear
                stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear'

                )return true;
            }
            
        }
    }
}
