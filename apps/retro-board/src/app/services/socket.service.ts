import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private websocketSubject = new BehaviorSubject<any>(null);

  public websocket$ = this.websocketSubject.asObservable();

  public set websocket(value: any) {
    this.websocketSubject.next(value);
  }

  public get websocketValue() {
    return this.websocketSubject.value?.text ?? '';
  }

  constructor() {
    const socket = webSocket('ws://localhost:8080');
    socket
      .pipe(map((data) => data as { text: string }))
      .subscribe(this.websocketSubject);

    this.websocketSubject.subscribe({
      next: (value) => console.log(`Message received: ${value?.text}`),
    });
  }
}
