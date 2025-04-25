import {Component, Input} from '@angular/core';
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
  @Input()
  public label: string | null = null;

  @Input()
  public url: string | null = null;

  @Input()
  public icon: string | null = null;
}
