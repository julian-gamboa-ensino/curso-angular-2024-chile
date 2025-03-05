# Serviços do Jogo

## GameService

O serviço principal que gerencia toda a lógica do jogo.

### Localização
`src/app/game.service.ts`

### Responsabilidades
- Gerenciamento do estado do jogo
- Lógica de matching de cartas
- Persistência de dados (localStorage)
- Controle de pontuação
- Verificação de fim de jogo
- Tratamento de SSR (Server-Side Rendering)

### Estado do Jogo

```typescript
export interface GameState {
  cards: Card[];
  score: number;
  isGameOver: boolean;
  isChecking: boolean;
  highScore: number;
}

export interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
  isComparing?: boolean;
}
```

### Propriedades Principais

```typescript
private readonly STORAGE_KEY = 'memory_game_state';
private readonly HIGH_SCORE_KEY = 'memory_game_high_score';
private readonly emojis = ['🎮', '🎲', '🎯', '🎨', '🎭', '🎸', '🎱', '🎪'];
```

### Inicialização e SSR

O serviço implementa tratamento especial para SSR:
```typescript
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
```

### Métodos Públicos

#### initializeGame()
Inicializa ou reinicia o jogo com estado limpo.
```typescript
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
  
  // Atualiza o estado
  this.updateGameState({
    isGameOver: false,
    score: 0
  });
}
```

#### flipCard(card: Card)
Manipula a ação de virar uma carta com verificações de estado.
```typescript
flipCard(card: Card): void {
  // Não permite virar cartas se o jogo acabou
  if (this.gameStateSubject.value.isGameOver) {
    return;
  }

  if (this.isChecking || this.flippedCards.length === 2 || card.isMatched || card.isFlipped) {
    return;
  }

  card.isFlipped = true;
  this.flippedCards.push(card);
  this.updateGameState();

  if (this.flippedCards.length === 2) {
    this.checkMatch();
  }
}
```

### Gerenciamento de Estado

O serviço utiliza BehaviorSubject para gerenciar o estado do jogo:
- Estado inicial limpo
- Atualizações atômicas
- Notificação de observadores
- Persistência automática

### Persistência de Dados

#### Local Storage
- `STORAGE_KEY`: Estado do jogo atual
- `HIGH_SCORE_KEY`: Recorde máximo
- Limpeza automática após vitória
- Verificação de ambiente

#### Métodos de Persistência
- `saveGameState()`: Salva estado atual
- `loadGameState()`: Carrega estado salvo
- `saveHighScore()`: Atualiza recorde
- `getHighScore()`: Obtém recorde atual

### Tratamento de Vitória

```typescript
private checkGameOver(): void {
  const isGameOver = this.cards.every(card => card.isMatched);
  if (isGameOver) {
    const finalScore = this.cards.filter(card => card.isMatched).length / 2;
    if (this.isBrowser) {
      this.saveHighScore(finalScore);
      localStorage.removeItem(this.STORAGE_KEY);
    }
    
    this.updateGameState({ 
      isGameOver: true,
      score: finalScore
    });
  }
}
```

### Otimizações de Performance

1. Manipulação direta de estado
2. Redução de operações de array
3. Atualizações eficientes de estado
4. Verificações de ambiente
5. Limpeza automática de recursos

### Dependências
- `@angular/core`
- `rxjs`
- `@angular/common`
- `isPlatformBrowser` 