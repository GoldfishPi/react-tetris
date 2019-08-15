import React, { useState } from 'react';
import styled from 'styled-components';
import {checkCollision } from '../gameHelpers.js';

import { createStage } from '../gameHelpers';

//hooks
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useInterval } from '../hooks/useInterval';
import { useGameStatus } from '../hooks/useGameStatus';

//image
import bgImage from '../img/bg.png';

//components
import Stage from './Stage.js';
import Display from './Display.js';
import StartButton from './StartButton.js';

const StyledTetrisWrapper = styled.div`
    width:100vw;
    height:100vh;
    background:url(${bgImage}) #000;
    background-size:cover;
    overflow:hidden;
`

const StyledTetris = styled.div`
    display:flex;
    align-items:flex-start;
    padding: 40px;
    margin:0 auto;
    max-width: 900px;
    aside {
        width:100%;
        max-width:200px;
        dispaly:block;
        padding: 0 20px;
    }
`

const Tetris = () => {

    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

    const movePlayer = dir => {
        if(!checkCollision(player, stage, { x:dir, y: 0})) {
            updatePlayerPos({x:dir, y:0});
        }
    }

    const startGame = () => {
        //reset everything lol
        setStage(createStage());
        setDropTime(1000);
        resetPlayer();
        setGameOver(false);
        setScore(0);
        setRows(0);
        setLevel(0);
    }

    const drop = () => {
        // increase level when player has cleared 10 rows

        //setDropTime(1000 / (level + 1) + 200);
        console.log('rows cleared', rowsCleared);
        if(rows > (level + 1) * 10) {
            setLevel(prev => prev + 1);
            //Also increase speed
            setDropTime(1000 / (level + 1) + 200);
        }
        if(!checkCollision(player, stage, { x:0, y: 1})) {
            updatePlayerPos({x: 0, y: 1, collided:false});
        } else {
            if(player.pos.y < 1) {
                console.log('GAME OVER LOL!!!');
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({ x:0, y:0, collided:true });
        }
    }

    const keyUp = ({ keyCode }) => {
        if(gameOver)return;
        if(keyCode === 40) {
            setDropTime(1000 / (level +1) + 200);
        }
    }

    const dropPlayer = () => {
        setDropTime(null);
        drop();
    }

    const move = ({ keyCode}) => {
        if(gameOver)return;
        switch(keyCode) {
            case 37:
                movePlayer(-1);
                break;
            case 39:
                movePlayer(1);
                break;
            case 40:
                dropPlayer();
                break;
            case 38:
                playerRotate(stage, 1);
                break;
            default:
                break;
        }
    }

    useInterval(() => {
        drop();
    }, dropTime);
    
    return (
        <StyledTetrisWrapper 
            role="button" 
            tabIndex="0" 
            onKeyUp={e => keyUp(e)}
            onKeyDown={e => move(e)}
        >
            <StyledTetris>
                <Stage stage={stage}/>
                <aside>
                    {gameOver ? (
                    <Display gameOver={gameOver} text="Game Over"/>
                    ) : (
                    <div>
                        <Display text={`score: ${score}`}/>
                        <Display text={`Rows: ${rows}`}/>
                        <Display text={`Level: ${level}`}/>
                    </div>
                    )}
                    <StartButton callback={startGame}/>
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
        )
}

export default Tetris;
