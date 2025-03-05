import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" 
         [class.flipped]="card.isFlipped"
         [class.matched]="card.isMatched"
         [class.comparing]="card.isComparing"
         (click)="onCardClick()"
         role="button"
         [attr.aria-label]="getAriaLabel()"
         [attr.aria-pressed]="card.isFlipped">
      <div class="card-inner">
        <div class="card-front" aria-hidden="true">❓</div>
        <div class="card-back" aria-hidden="true">{{ card.value }}</div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      width: 100px;
      height: 100px;
      perspective: 1000px;
      cursor: pointer;
      margin: 10px;
    }

    .card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      text-align: center;
      transition: transform 0.6s;
      transform-style: preserve-3d;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .card.flipped .card-inner {
      transform: rotateY(180deg);
    }

    .card-front, .card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2em;
      background: white;
      border-radius: 8px;
    }

    .card-back {
      transform: rotateY(180deg);
      background: #f0f0f0;
    }

    .card.matched .card-inner {
      box-shadow: 0 0 8px rgba(0,255,0,0.5);
    }

    .card.comparing .card-inner {
      box-shadow: 0 0 12px rgba(255,165,0,0.8);
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `]
})
export class CardComponent {
  @Input() card!: Card;
  @Output() flip = new EventEmitter<Card>();

  onCardClick(): void {
    this.flip.emit(this.card);
  }

  getAriaLabel(): string {
    if (this.card.isMatched) {
      return `Carta com emoji ${this.card.value} - Par encontrado`;
    }
    if (this.card.isFlipped) {
      return `Carta com emoji ${this.card.value} - Virada`;
    }
    return 'Carta não revelada - Clique para virar';
  }
}
