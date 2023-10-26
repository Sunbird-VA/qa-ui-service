
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of as observableOf, throwError as observableThrowError, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { v4 as UUID } from 'uuid';
let uuid = UUID();

@Injectable({
  providedIn: 'root'
})
export class ChatLibService {

  http: HttpClient;
  public chatList = [];
  public userId ;
  public did;
  public appId;
  public channel;
  public chatbotUrl;
  public context;
  public qaID;
  constructor(http: HttpClient) {
    this.http = http;
    const data = this.retrieveData('chat_history'); 
    this.chatList = data ? data : [];
  }

  chatpost(req?: any): Observable<any> {
    if(!this.did) {
      this.did = Date.now();
    }
    const headers = {'x-request-id': uuid };
    const options = { headers: headers };
    req.data['userId'] = this.userId;
    req.data['appId'] = this.appId;
    req.data['channel'] = this.channel;
    req.data['From'] = (this.did).toString();
    req.data['context'] = this.context;
    return this.http.post(this.chatbotUrl, req.data, options).pipe(
      mergeMap((data: any) => {
        return observableOf(data);
      }));
  }

  chatpostJugalbandi(req?: any): Observable<any> {
   
    const options = { 
      params: {
        uuid_number: this.qaID,
        query_string: req.query,
        skip_cache: true
      }
     };
    return this.http.get(this.chatbotUrl + '/generate_answers', options).pipe(
      mergeMap((data: any) => {
        return observableOf(data);
      }));
  }

  recordFeedback(req?: any): Observable<any> {
    return this.http.put(this.chatbotUrl + "/user_feedback", req).pipe(
      mergeMap((data: any) => {
        return observableOf(data);
      }));
  }


  chatListPush(source, msg) {
    const chat = {
      'text': msg,
      'type': source
    }
    this.chatList.push(chat);
    this.storeData('chat_history', this.chatList);
  }

  chatListPushRevised(source, msg) {
    if(!msg.button){
      msg["buttons"] = [{
            "text": "👍",
            "value": "up"
        },
        {
            "text": "👎",
            "value": "down"
        }]
    }
   
    const chat = {
      'buttons': msg.buttons,
      'text': msg.answer ? msg.answer : msg,
      'type': source,
      ...(msg?.id && { id: msg.id })
    }
    this.chatList.push(chat);
    this.storeData('chat_history', this.chatList);
  }

  // Function to store data in session storage
  storeData(key, value) {
    // Using plain sessionStorage
    sessionStorage.setItem(key, JSON.stringify(this.chatList));
  }

  // Function to retrieve data from session storage
  retrieveData(key: string) {
    // Using plain sessionStorage
    const storedValue = sessionStorage.getItem(key);
    try {
      return JSON.parse(storedValue);
    } catch (error) {
      return undefined;
    }
  }

  disableButtons(value,  index) {
    var btns =  this.chatList[index].buttons
    for(var btn of btns) {
      if(value === btn.value) {
        btn.clicked = true
      }
      btn.disabled = true
    }
    this.storeData('chat_history', this.chatList);
  }
}
