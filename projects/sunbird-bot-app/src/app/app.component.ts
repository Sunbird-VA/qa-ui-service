import { Component, Inject, OnInit } from '@angular/core';
import { environment } from './../environments/environment';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = environment.botName;
  botConfig: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.router.events
         .subscribe((event) => {
           if (event instanceof NavigationEnd) {
             let uuid = this.route.snapshot.queryParamMap.get('uuid');
              this.botConfig = {
                header: environment.botName,
                chatbotUrl: environment.apiUrl,
                uuid: uuid ?  uuid : environment.uuid,
                imageUrl: "https://www.sunbird.org/images/sunbird-logo-new.png"
              }
           }
       }); 

  }

}
