import { Injectable } from '@angular/core';
import { MessageRequest, MessageRequestSchema, MessageEnum } from '@retro-board/shared/models';
import { BehaviorSubject, concatMap, filter, map, tap, Observable } from 'rxjs';
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
  private websocketText$ = this.websocketSubject.pipe(filter((message) => message.type === 'text'));
  private websocketLiked$ = this.websocketSubject.pipe(filter((message) => message.type === 'liked'));
  private websocketLearned$ = this.websocketSubject.pipe(filter((message) => message.type === 'learned'));
  private websocketLacked$ = this.websocketSubject.pipe(filter((message) => message.type === 'lacked'));

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

  public socketStream$(type: MessageEnum): Observable<MessageRequest> {
    switch (type) {
      case 'text':
        return this.websocketText$;
      case 'learned':
        return this.websocketLearned$;
      case 'liked':
        return this.websocketLiked$;
      case 'lacked':
        return this.websocketLacked$;
    }
  }
}
