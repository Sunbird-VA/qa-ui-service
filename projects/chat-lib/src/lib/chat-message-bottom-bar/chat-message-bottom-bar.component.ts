import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ChatLibService } from '../chat-lib.service';

@Component({
  selector: 'lib-chat-message-bottom-bar',
  templateUrl: './chat-message-bottom-bar.component.html',
  styleUrls: ['./chat-message-bottom-bar.component.css']
})
export class ChatMessageBottomBarComponent implements OnInit {
  public messageForm = new FormGroup({
    message: new FormControl('', Validators.required)
  });
  message: any;
  typingLoader: boolean = false;
  public unsubscribe$ = new Subject<void>();
  constructor(public chatService: ChatLibService) {
  }

  ngOnInit() {
  }

  sendMessage() {
    let query = this.messageForm.controls.message.value;
    if (!query) { return; }
    this.chatService.chatListPush('sent', query);
    this.messageForm.controls.message.reset();
    const req = {
      query
    }
    this.typingLoader = true;
    this.messageForm.disable();
    this.chatService.chatpostJugalbandi(req).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.chatService.chatListPushRevised('recieved', data)
      this.typingLoader = false;
      this.messageForm.enable()
    }, err => {
      console.log("Error ====> ", err)
      this.typingLoader = false;
      this.messageForm.enable()
      this.chatService.chatListPush('recieved', 'Something went wrong, try again later!' )
    });
  }
}
