import {Component, Input} from '@angular/core';
import {Link} from '../link';
import {MatIcon} from '@angular/material/icon';
import {MatListItem, MatListItemTitle} from '@angular/material/list';
import {RouterLink} from '@angular/router';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-menu-item',
  imports: [
    MatIcon,
    MatListItem,
    MatListItemTitle,
    RouterLink,
    MatTooltip
  ],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss'
})
export class MenuItemComponent {
  @Input({required: true})
  public value: Link | null = null;
}
