import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, Input } from '@angular/core';
import { ChatLibService } from '../chat-lib.service';
import { takeUntil } from 'rxjs/operators';
import { Subject} from 'rxjs';
@Component({
  selector: 'lib-chat-message-list',
  templateUrl: './chat-message-list.component.html',
  styleUrls: ['./chat-message-list.component.scss']
})
export class ChatMessageListComponent implements OnInit, AfterViewChecked {
  @ViewChild('msgScrollToBottom') private msgScrollToBottom: ElementRef;
  
  @Input() did: string;
  @Input() userId: string;
  @Input() channel: string;
  @Input() appId: string;
  @Input() chatbotUrl:string;
  @Input() context:string;
  @Input() qaID:string;

  public array = [
  ];
  public unsubscribe$ = new Subject<void>();
  constructor(public chatService: ChatLibService) { }

  ngOnInit() {
    this.array = this.chatService.chatList;
    this.chatService.userId = this.userId || null;
    this.chatService.did = this.did || null;
    this.chatService.channel = this.channel || null;
    this.chatService.appId = this.appId || null;
    this.chatService.chatbotUrl = this.chatbotUrl;
    this.chatService.context = this.context || null;
    this.chatService.qaID = this.qaID;
    const sunbirdRCDefaultMsg = "Hello! I'm here to provide assistance with any questions you might have regarding the functional aspects of Sunbird RC, encompassing topics such as verifiable credentials and electronic registries. Additionally, I can address your inquiries about the high-level architecture of Sunbird RC. If I can't assist you, I'll do my best to direct you to the right resources."
    const sixBBDefaultMsg  = "Got a question about our Sunbird building blocks? Ask me anything on Educator (ED), Co-creator (coKreat), Librarian (Knowlg), Examiner (inQuiry), Learner (Lern) & Observer (Obsrv)."
    if(this.qaID === "5d921c7e-5846-11ee-b27d-acde48001122" && sessionStorage.getItem('initialMsg') != "True") {
      this.chatService.chatListPush('recieved', sunbirdRCDefaultMsg)
      sessionStorage.setItem('initialMsg', "True");
    }

    if(this.qaID === "a2b87882-6e6e-11ee-92a3-0242ac110002" && sessionStorage.getItem('initialMsg') != "True") {
      this.chatService.chatListPush('recieved', sixBBDefaultMsg)
      sessionStorage.setItem('initialMsg', "True");
    }

    // if (this.array.length === 0 ) {
    //   const req = {
    //     data: {
    //       Body: "0"
    //       }
    //     }
    //   this.chatService.chatpost(req).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
    //     this.chatService.chatListPushRevised('recieved', data)
    //   },err => {
    //     this.chatService.chatListPushRevised('recieved', err.error.data)
    //   });
    // }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.msgScrollToBottom.nativeElement.scrollTop = this.msgScrollToBottom.nativeElement.scrollHeight;
    } catch (err) { 
      
    }
  }

}
