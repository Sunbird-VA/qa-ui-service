import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ChatLibService } from '../chat-lib.service';
import { takeUntil } from 'rxjs/operators';
import { Subject} from 'rxjs';

declare const marked:any;

@Component({
  selector: 'lib-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
}) 
export class ChatMessageComponent implements OnInit {
  @Input() data;
  @Input() index;
  public buttons = [];
  public isButtonAvailable:boolean = false;
  public unsubscribe$ = new Subject<void>();
  constructor(public chatService: ChatLibService) { 
  }

  ngOnInit() {
    if(this.data.buttons) {
      this.isButtonAvailable = true;
      this.buttons = this.data.buttons
    }
    this.buttons = this.data.buttons?this.data.buttons:''
  }

  parseMardownText(text) {
    return  marked.parse(text);
  }

  buttonClicked(value, text, id) {
    this.disableButtons(value, this.index)
    const formData = new FormData();
    // append your data
    formData.append('question_id', id);
    formData.append('feedback_type', value);
    this.sendMessage(formData)
  }

  disableButtons(value, index){
    this.chatService.disableButtons(value, index)
  }

  sendMessage(req) {
    this.chatService.recordFeedback(req).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      // this.chatService.chatListPushRevised('recieved', data)
      console.log(data);
    },err => {
      // this.chatService.chatListPushRevised('recieved', err.error)
      console.log(err);
    });
  }
}
