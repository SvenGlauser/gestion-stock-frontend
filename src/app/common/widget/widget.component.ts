import {Component, input, InputSignal} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-widget',
  imports: [
    MatCard,
    MatCardContent,
    MatIcon,
    RouterLink
  ],
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.scss'
})
export class WidgetComponent {
  public label: InputSignal<string> = input.required();
  public url: InputSignal<string> = input.required();
  public icon: InputSignal<string> = input.required();
  public disabled: InputSignal<boolean> = input.required();
}
