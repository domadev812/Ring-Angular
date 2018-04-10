import 'rxjs/add/observable/throw';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Routes, RouterModule, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MessageBoardService } from '../../app.services-list';
import { error } from 'util';
import { Model } from '../../app.models-list';
import { NavbarService } from '../../app.services-list';
import { GlobalState } from '../../global.state';

@Component({
  selector: 'app-messageboard',
  templateUrl: './messageboard.component.html',
  styleUrls: ['./messageboard.component.scss']
})
export class MessageBoardComponent implements OnInit {

  title: string;
  messageBoard: Model.MessageBoard;
  link: string;
  message: string;
  currentMessage: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navBarService: NavbarService,
    private messageBoardService: MessageBoardService,
    public global: GlobalState,
  ) {
  }



  ngOnInit() {
    this.messageBoard = new Model.MessageBoard({});
    this.navBarService.show();
    this.navBarService.activeTabChanged('notifications');
    this.message = '';
    this.title = 'Message Board';
    this.navBarService.activeTabChanged('notifications');
    this.getMessage();
    this.global.selectedTab = 'notifications';
  }

  getMessage() {
    this.messageBoardService.getMessage().subscribe((res: Model.MessageBoard) => {
      this.currentMessage = res.message;
    }, (errors) => {
      alert('Server error');
    });
  }

  sendMessage() {
    this.messageBoardService.updateMessage(this.messageBoard).subscribe((res) => {
      alert('The message has been posted!');
      this.router.navigate(['notifications']);
    }, (errors) => {
      alert('Server error');
    });
  }

  cancelMessage(): void {
    this.router.navigate(['notifications']);
  }

}