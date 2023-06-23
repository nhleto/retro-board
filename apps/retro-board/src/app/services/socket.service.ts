import { Injectable } from '@angular/core';
import { MessageRequest, MessageRequestSchema } from '@retro-board/shared/models';
import { BehaviorSubject, concatMap, filter, map, tap } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket = webSocket({
    url: 'ws://localhost:8080',
    deserializer: ({ data }) => data,
  });

  private websocketSubject = new BehaviorSubject<MessageRequest>({} as MessageRequest);
  public websocketText$ = this.websocketSubject.pipe(filter((message) => message.type === 'text'));

  public set websocket(value: MessageRequest) {
    this.socket.next(value);
  }

  public get websocketValue() {
    return this.websocketSubject.value?.message ?? '';
  }

  constructor() {
    this.socket
      .pipe(
        concatMap((data) => data.text()),
        map((data) => MessageRequestSchema.parse(JSON.parse(data as string)))
      )
      .subscribe((data) => this.websocketSubject.next(data));
  }
}
