# Componentes do Jogo

## GameComponent

O componente principal que gerencia a interface do jogo.

### Localização
`src/app/game/game.component.ts`

### Responsabilidades
- Renderiza o tabuleiro do jogo
- Exibe pontuação atual e recorde
- Gerencia estados de vitória
- Controla reinício do jogo
- Gerencia overlay de vitória

### Template
```typescript
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
`
```

### Estilos Principais

#### Layout e Responsividade
```scss
.game-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

.game-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  justify-items: center;
  margin-top: 20px;
}
```

#### Overlay de Vitória
```scss
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
}
```

#### Animações
```scss
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
```

## CardComponent

Componente que representa uma carta individual no jogo.

### Localização
`src/app/card/card.component.ts`

### Responsabilidades
- Renderiza uma carta individual
- Gerencia estados visuais da carta
- Implementa acessibilidade
- Gerencia animações e transições

### Template
```typescript
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
`
```

### Estados da Carta
- **Normal**: Carta não revelada
- **Flipped**: Carta virada
- **Matched**: Par encontrado
- **Comparing**: Em processo de comparação

### Acessibilidade
- Role "button" para interatividade
- Aria-label dinâmico baseado no estado
- Aria-pressed para estado de virada
- Elementos decorativos marcados como hidden

### Animações
- Transição 3D suave ao virar
- Efeito de pulso durante comparação
- Brilho verde ao encontrar par
- Sombras e bordas responsivas

### Métodos
```typescript
getAriaLabel(): string {
  if (this.card.isMatched) {
    return `Carta com emoji ${this.card.value} - Par encontrado`;
  }
  if (this.card.isFlipped) {
    return `Carta com emoji ${this.card.value} - Virada`;
  }
  return 'Carta não revelada - Clique para virar';
}
```

## Integração entre Componentes

### Fluxo de Dados
1. GameService mantém estado global
2. GameComponent observa alterações
3. CardComponent recebe dados via @Input
4. Eventos propagados via @Output

### Comunicação
- Unidirecional do serviço para componentes
- Eventos de clique propagados para o serviço
- Estado sincronizado via BehaviorSubject

### Performance
- Change Detection OnPush
- Referências imutáveis
- Animações via CSS
- Lazy loading de recursos

## Dependências
- CommonModule
- BehaviorSubject (RxJS)
- GameService
- Animações CSS 