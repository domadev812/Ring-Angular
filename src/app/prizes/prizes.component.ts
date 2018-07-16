
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
import { ToastService } from '../_services/toast.service';

@Component({
  selector: 'app-prizes',
  templateUrl: './prizes.component.html',
  styleUrls: ['./prizes.component.scss']
})
export class PrizesComponent implements OnInit {
  scrollClass: String = 'table-content-with-search';
  public selectedTab: String = '';
  private cardNumber: string;
  private modalRef: BsModalRef;
  private isActivated: boolean;
  private startDate: Date = new Date();
  private endDate: Date = new Date();
  private firstDate: Date = new Date();
  private lastDate: Date = new Date();
  private validPick: boolean;
  private checked = true;
  private modalTitle: string;
  canCreateNewPrize: boolean;
  canUseAwardedCsv: boolean;
  canActivateKeycard: boolean;
  canViewAwardedPrizes: boolean;
  canViewKeycardIndex: boolean;
  canUseKeycardCsv: boolean;
  private config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: true
  };

  exportForm: FormGroup;
  keycardExportForm: FormGroup;

  constructor(private router: Router,
    private modalService: BsModalService,
    private prizesService: PrizesService,
    private global: GlobalState,
    private navBarService: NavbarService,
    private currentUserService: CurrentUserService,
    private authProvider: AuthService,
    public access: AccessService,
    public toastService: ToastService
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

    this.keycardExportForm = new FormGroup({
      firstDate: new FormControl(),
      lastDate: new FormControl()
    });
  }


  getUser() {
    this.currentUserService.getCurrentUser(this.authProvider).then((user: Model.User) => {
      if (user) {
        this.canCreateNewPrize = this.access.getAccess(user.getRole()).functionalityAccess.newPrizeButton;
        this.canUseAwardedCsv = this.access.getAccess(user.getRole()).functionalityAccess.awardedCsvButton;
        this.canActivateKeycard = this.access.getAccess(user.getRole()).functionalityAccess.activateKeycardButton;
        this.canViewAwardedPrizes = this.access.getAccess(user.getRole()).functionalityAccess.awardedPrizesIndex;
        this.canViewKeycardIndex = this.access.getAccess(user.getRole()).functionalityAccess.keycardIndexTab;
        this.canUseKeycardCsv = this.access.getAccess(user.getRole()).functionalityAccess.keycardCsv;
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
  openKeycardCsv(keycard: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(keycard, this.config);
  }

  activate(): void {
    if (this.cardNumber && this.cardNumber.length > 0) {
      this.prizesService.activateCardNumber(this.cardNumber).subscribe((res) => {
        this.isActivated = true;
        this.toastService.show('Key card activated.');
      }, (err) => {
        this.isActivated = false;
        this.toastService.showError(err.message);
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
  keycardExport(): void {

    if (this.firstDate < this.lastDate || this.checked) {
      this.prizesService.exportKeycardCSV(this.keycardExportForm.value)
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

}