
import 'rxjs/add/observable/throw';
import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, Routes, RouterModule } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Model } from '../app.models-list';
import { error } from 'util';
import { PrizesService } from '../app.services-list';
import { NavbarService, CurrentUserService, AuthService, AccessService } from '../app.services-list';
import { GlobalState } from '../global.state';

@Component({
  selector: 'app-prizes',
  templateUrl: './prizes.component.html',
  styleUrls: ['./prizes.component.scss']
})
export class PrizesComponent implements OnInit {
  public selectedTab: String = '';
  private cardNumber: string;
  private modalRef: BsModalRef;
  private isActivated: boolean;
  private startDate: Date = new Date();
  private endDate: Date = new Date();
  private validPick: boolean;
  private checked = true;
  canCreateNewPrize: boolean;
  canUseAwardedCsv: boolean;
  canActivateKeycard: boolean;
  canViewAwardedPrizes: boolean;
  canViewKeycardIndex: boolean;
  private config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: true
  };

  exportForm: FormGroup;

  constructor(private router: Router,
    private modalService: BsModalService,
    private prizesService: PrizesService,
    private global: GlobalState,
    private navBarService: NavbarService,
    private currentUserService: CurrentUserService,
    private authProvider: AuthService,
    public access: AccessService
  ) { }

  ngOnInit() {
    this.navBarService.show();
    this.navBarService.activeTabChanged('prizes');
    if (this.global.selectedTab === '') {
      this.selectedTab = 'prizes';
    } else {
      this.selectedTab = this.global.selectedTab;
    }
    this.global.selectedTab = '';

    this.exportForm = new FormGroup({
      allCheck: new FormControl(true),
      startDate: new FormControl(),
      endDate: new FormControl()
    });
    this.exportForm.controls['startDate'].disable();
    this.exportForm.controls['endDate'].disable();
    this.startDate = new Date();
    this.endDate = new Date();
    this.validPick = true;
    this.getUser();
  }


  getUser() {
    this.currentUserService.getCurrentUser(this.authProvider).then((user: Model.User) => {
      if (user) {
        this.canCreateNewPrize = this.access.getAccess(user.getRole()).functionalityAccess.newPrizeButton;
        this.canUseAwardedCsv = this.access.getAccess(user.getRole()).functionalityAccess.awardedCsvButton;
        this.canActivateKeycard = this.access.getAccess(user.getRole()).functionalityAccess.activateKeycardButton;
        this.canViewAwardedPrizes = this.access.getAccess(user.getRole()).functionalityAccess.awardedPrizesIndex;
        this.canViewKeycardIndex = this.access.getAccess(user.getRole()).functionalityAccess.keycardIndexTab;
      }
    });
  }

  switchTab(selectedTab: String): void {
    this.selectedTab = selectedTab;
  }

  addPrize(): void {
    this.router.navigate(['prizeadd']);
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  openCsv(csv: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(csv, this.config);
  }

  activate(event): void {
    if (this.cardNumber && this.cardNumber.length > 0) {
      this.prizesService.activateCardNumber(this.cardNumber).subscribe((res) => {
        this.isActivated = true;
        alert('Key Card Activated.');
      }, (errors) => {
        this.isActivated = false;
        alert('There was a problem. They card was not activated.');
      });
    }
  }

  export(): void {
    if (this.startDate < this.endDate || this.checked) {
      this.prizesService.exportCSV(this.exportForm.value)
        .subscribe((err) => {
          let message = err;
        });
    } else {
      this.validPick = false;
    }
  }

  check(value): void {
    this.checked = value;
    if (this.checked) {
      this.exportForm.controls['startDate'].disable();
      this.exportForm.controls['endDate'].disable();
    } else {
      this.exportForm.controls['startDate'].enable();
      this.exportForm.controls['endDate'].enable();
    }
  }

  mouseWheelUp(): void {
    let scrollArea = document.getElementsByClassName('table-content-with-search');
    scrollArea[0].scrollTop = scrollArea[0].scrollTop - 40;
  }
  mouseWheelDown(): void {
    let scrollArea = document.getElementsByClassName('table-content-with-search');
    scrollArea[0].scrollTop = scrollArea[0].scrollTop + 40;
  }
}
