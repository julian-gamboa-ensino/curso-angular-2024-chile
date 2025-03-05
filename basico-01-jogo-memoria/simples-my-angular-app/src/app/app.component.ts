import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game/game.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GameComponent],
  template: `
    <app-game></app-game>
  `,
  styles: []
})
export class AppComponent {
  title = 'my-angular-app';
}
