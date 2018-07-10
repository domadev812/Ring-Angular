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
import { ToastService } from '../../_services/toast.service';

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
  public creating = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navBarService: NavbarService,
    private messageBoardService: MessageBoardService,
    public toastService: ToastService,
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
    this.creating = true;
    this.messageBoardService.getMessage().subscribe((res: Model.MessageBoard) => {
      this.creating = false;
      if (!res.message)
        this.currentMessage = 'Welcome To Keys To Success';
      else
        this.currentMessage = res.message;
    }, (errors) => {
      this.toastService.showError('Server error');;
    });
  }

  sendMessage() {
    this.creating = true;
    this.messageBoardService.updateMessage(this.messageBoard).subscribe((res) => {
      this.creating = false;
      this.toastService.show('The message has been posted!');
      this.router.navigate(['notifications']);
    }, (errors) => {
      this.toastService.showError('Server error');;
    });
  }

  cancelMessage(): void {
    this.router.navigate(['notifications']);
  }

}