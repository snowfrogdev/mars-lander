import * as PIXI from 'pixi.js';
import { simulations, generation, bestScore, averageScore, landed } from './index';

export function initializeText() {
  const textStyle = new PIXI.TextStyle({ fontFamily: 'sans-serif', fontSize: 15, align: 'start', fill: 'white' });
  
  const simText = new PIXI.Text(`Simulations: ${simulations}`, textStyle);
  simText.scale.y = -7;
  simText.scale.x = 7;
  simText.x = 40;
  simText.y = 2960;

  const generationText = new PIXI.Text(`Generation: ${generation}`, textStyle);
  generationText.scale.y = -7;
  generationText.scale.x = 7;
  generationText.x = 40;
  generationText.y = 2820;

  const bestScoreText = new PIXI.Text(`Best Score: ${bestScore}`, textStyle);
  bestScoreText.scale.y = -7;
  bestScoreText.scale.x = 7;
  bestScoreText.x = 40;
  bestScoreText.y = 2680;

  const averageScoreText = new PIXI.Text(`Average Score: ${averageScore}`, textStyle);
  averageScoreText.scale.y = -7;
  averageScoreText.scale.x = 7;
  averageScoreText.x = 40;
  averageScoreText.y = 2540;

  const landedText = new PIXI.Text(`Landed: ${landed}`, textStyle);
  landedText.scale.y = -7;
  landedText.scale.x = 7;
  landedText.x = 40;
  landedText.y = 2400;
  
  return { simText, generationText, bestScoreText, averageScoreText, landedText };
}
