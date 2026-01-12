import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-message.html',
  styleUrl: './error-message.css'
})
export class ErrorMessageComponent {
  @Input() message: string = 'El contenido no está disponible en este momento';
  @Input() showIcon: boolean = true;
  @Input() type: 'error' | 'warning' | 'info' = 'error';
}
