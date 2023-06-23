import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SocketService } from '../../services/socket.service';
import { Observable, map, tap } from 'rxjs';
import { scan } from 'rxjs/operators';
import { z } from 'zod';
import { Message, MessageRequest, MessageSchema } from '@retro-board/shared/models';

@Component({
  selector: 'retro-board-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public textForm = this.fb.group({
    text: this.fb.control('', Validators.required),
  });

  // public messages$ = this.socketService.websocket$.pipe(
  //   tap((data) => console.log(data, this.socketService.websocketValue)),
  //   map((data) => [data?.text])
  // );

  messages$ = this.socketService.websocketText$.pipe(
    scan((messages: string[], message: MessageRequest) => [...messages, message.message], [])
  );

  constructor(private fb: FormBuilder, private socketService: SocketService) {}

  ngOnInit() {
    this.socketService.websocketText$.subscribe((data) => console.log(data.message));
  }

  public submit() {
    const value = this.textForm.value;

    if (!MessageSchema.safeParse(value).success || this.textForm.invalid) {
      console.error('Invalid type');
      return;
    }

    const messageValue: Message = MessageSchema.parse(value);
    const payload: MessageRequest = { type: 'text', message: messageValue?.text ?? '' };
    this.socketService.websocket = payload;
    this.textForm.reset();
  }
}
