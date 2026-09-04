import {Injectable, signal, WritableSignal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  public readonly isView: WritableSignal<boolean> = signal<boolean>(false);
}
