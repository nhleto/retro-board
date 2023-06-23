import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SocketService } from '../../services/socket.service';
import { Observable, map, tap } from 'rxjs';
import { scan } from 'rxjs/operators';

@Component({
  selector: 'retro-board-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public textForm = this.fb.group({
    text: this.fb.control(''),
  });

  // public messages$ = this.socketService.websocket$.pipe(
  //   tap((data) => console.log(data, this.socketService.websocketValue)),
  //   map((data) => [data?.text])
  // );

  messages$ = this.socketService.websocket$.pipe(
    scan((messages, message) => [...messages, message], [])
  );

  constructor(private fb: FormBuilder, private socketService: SocketService) {}

  public submit() {
    const value = this.textForm.value;
    console.log(value);

    if (value) {
      this.socketService.websocket = value;
    }
  }
}
