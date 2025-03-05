import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
  isComparing?: boolean;
}

export interface GameState {
  cards: Card[];
  score: number;
  isGameOver: boolean;
  isChecking: boolean;
  highScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly STORAGE_KEY = 'memory_game_state';
  private readonly HIGH_SCORE_KEY = 'memory_game_high_score';
  private readonly emojis = ['🎮', '🎲', '🎯', '🎨', '🎭', '🎸', '🎱', '🎪'];
  private cards: Card[] = [];
  private isChecking = false;
  private isBrowser: boolean;
  private gameStateSubject: BehaviorSubject<GameState>;
  private flippedCards: Card[] = [];

  gameState$;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    const initialState: GameState = {
      cards: [],
      score: 0,
      isGameOver: false,
      isChecking: false,
      highScore: this.isBrowser ? this.getHighScore() : 0
    };

    this.gameStateSubject = new BehaviorSubject<GameState>(initialState);
    this.gameState$ = this.gameStateSubject.asObservable();

    if (this.isBrowser) {
      this.loadGameState();
    } else {
      this.initializeGame();
    }
  }

  private getHighScore(): number {
    if (!this.isBrowser) return 0;
    const savedScore = localStorage.getItem(this.HIGH_SCORE_KEY);
    return savedScore ? parseInt(savedScore, 10) : 0;
  }

  private saveHighScore(score: number): void {
    if (!this.isBrowser) return;
    const currentHighScore = this.getHighScore();
    if (score > currentHighScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, score.toString());
      this.updateGameState({ highScore: score });
    }
  }

  private saveGameState(): void {
    if (!this.isBrowser) return;
    const state = {
      cards: this.cards,
      score: this.gameStateSubject.value.score,
      highScore: this.gameStateSubject.value.highScore
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  private loadGameState(): void {
    if (!this.isBrowser) return;
    const savedState = localStorage.getItem(this.STORAGE_KEY);
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        this.cards = state.cards;
        this.updateGameState();
      } catch (e) {
        console.error('Erro ao carregar estado do jogo:', e);
        this.initializeGame();
      }
    } else {
      this.initializeGame();
    }
  }

  initializeGame(): void {
    // Reseta todos os estados
    this.cards = [];
    this.flippedCards = [];
    this.isChecking = false;
    
    // Cria novas cartas
    const cardValues = [...this.emojis, ...this.emojis];
    this.cards = cardValues
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
        isComparing: false
      }));
    
    // Atualiza o estado com isGameOver explicitamente definido como false
    this.updateGameState({
      isGameOver: false,
      score: 0
    });

    // Salva o novo estado
    if (this.isBrowser) {
      this.saveGameState();
    }
  }

  flipCard(card: Card): void {
    // Não permite virar cartas se o jogo acabou
    if (this.gameStateSubject.value.isGameOver) {
      return;
    }

    // Verifica se a carta já está virada ou se já existem duas cartas viradas
    if (this.isChecking || this.flippedCards.length === 2 || card.isMatched || card.isFlipped) {
      return;
    }

    // Atualiza imediatamente o estado da carta
    card.isFlipped = true;
    this.flippedCards.push(card);

    // Atualiza o estado do jogo
    this.updateGameState();

    // Se duas cartas foram viradas, verifica o par
    if (this.flippedCards.length === 2) {
      this.checkMatch();
    }
  }

  private checkMatch(): void {
    this.isChecking = true;
    
    // Marca as cartas como sendo comparadas
    this.flippedCards.forEach(card => {
      card.isComparing = true;
    });
    this.updateGameState();

    setTimeout(() => {
      const [card1, card2] = this.flippedCards;
      const isMatch = card1.value === card2.value;

      // Atualiza o estado das cartas
      this.flippedCards.forEach(card => {
        card.isFlipped = isMatch;
        card.isMatched = isMatch;
        card.isComparing = false;
      });

      // Limpa as cartas viradas
      this.flippedCards = [];
      this.isChecking = false;

      // Verifica se o jogo acabou
      this.checkGameOver();
      this.updateGameState();

      if (this.isBrowser) {
        this.saveGameState();
      }
    }, 1000);
  }

  private checkGameOver(): void {
    const isGameOver = this.cards.every(card => card.isMatched);
    if (isGameOver) {
      const finalScore = this.cards.filter(card => card.isMatched).length / 2;
      if (this.isBrowser) {
        this.saveHighScore(finalScore);
      }
      
      this.updateGameState({ 
        isGameOver: true,
        score: finalScore
      });

      // Limpa o estado salvo quando o jogo termina
      if (this.isBrowser) {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  private updateGameState(partialState: Partial<GameState> = {}): void {
    const currentState = this.gameStateSubject.value;
    const newState = {
      ...currentState,
      cards: [...this.cards],
      score: this.cards.filter(card => card.isMatched).length / 2,
      isChecking: this.isChecking,
      ...partialState
    };
    
    this.gameStateSubject.next(newState);
  }
}
