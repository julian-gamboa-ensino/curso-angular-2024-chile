import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { GameService, Card, GameState } from '../game.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <div class="game-container">
      <div class="game-header">
        <h1>Memory Game</h1>
        <div class="score-container">
          <div class="score">Score: {{ (gameState$ | async)?.score || 0 }}</div>
          <div class="high-score">High Score: {{ (gameState$ | async)?.highScore || 0 }}</div>
        </div>
        <button (click)="restartGame()" class="restart-button">Restart Game</button>
      </div>
      
      <div class="game-board">
        @for (card of (gameState$ | async)?.cards; track card.id) {
          <app-card [card]="card" (flip)="onCardFlip($event)"></app-card>
        }
      </div>

      @if ((gameState$ | async)?.isGameOver) {
        <div class="victory-overlay">
          <div class="victory-message">
            <h2>Parabéns! Você venceu! 🎉</h2>
            <p>Você encontrou todos os pares!</p>
            @if ((gameState$ | async)?.score === (gameState$ | async)?.highScore) {
              <p class="new-record">Novo Recorde! 🏆</p>
            }
            <button (click)="restartGame()" class="restart-button">Jogar Novamente</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .game-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      position: relative;
    }

    .game-header {
      text-align: center;
      margin-bottom: 20px;
    }

    h1 {
      color: #333;
      margin-bottom: 10px;
    }

    .score-container {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 10px;
    }

    .score, .high-score {
      font-size: 1.5em;
    }

    .high-score {
      color: #4CAF50;
    }

    .restart-button {
      padding: 10px 20px;
      font-size: 1.1em;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #45a049;
      }
    }

    .game-board {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      justify-items: center;
      margin-top: 20px;
    }

    .victory-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .victory-message {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      text-align: center;
      animation: fadeIn 0.5s ease-out;

      h2 {
        color: #4CAF50;
        margin-bottom: 1rem;
      }

      p {
        margin-bottom: 1.5rem;
      }

      .new-record {
        color: #ff9800;
        font-size: 1.2em;
        font-weight: bold;
        animation: pulse 1s infinite;
      }

      .restart-button {
        margin-top: 1rem;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  `]
})
export class GameComponent {
  constructor(private gameService: GameService) {
    this.gameState$ = this.gameService.gameState$;
  }

  gameState$;

  onCardFlip(card: Card): void {
    this.gameService.flipCard(card);
  }

  restartGame(): void {
    this.gameService.initializeGame();
  }
}
