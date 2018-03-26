import 'rxjs/add/observable/throw';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Routes, RouterModule, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { error } from 'util';
import { MultiSelectService, PrizesService, CurrentUserService, AuthService } from '../../app.services-list';
import { Model } from '../../app.models-list';
import { GlobalState } from '../../global.state';
import { MultiSelectUtil } from '../../_utils/multiselect.util';
import { NavbarService } from '../../app.services-list';

@Component({
  selector: 'app-prizeadd',
  templateUrl: './prizeadd.component.html',
  styleUrls: ['./prizeadd.component.scss']
})
export class PrizeAddComponent implements OnInit {
  prize: Model.Prize;
  originalPrize: Model.Prize;
  title: string;
  public editFlag: boolean;
  public disableFlag: boolean;
  public sponsorList = [];
  public selectedSponsor = [];
  public deliveryList = [{ itemName: 'In-House', id: 1 }, { itemName: 'Third Party', id: 2 }];
  public selectedDelivery = [];
  public ktsSelectSettings: any = {};
  public ktsDeliverySelectSettings = {};
  public creating = false;
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private prizesService: PrizesService,
    private multiSelectService: MultiSelectService,
    public global: GlobalState,
    public navBarService: NavbarService,
    private currentUserService: CurrentUserService,
    public authProvider: AuthService
  ) { }

  ngOnInit() {
    this.navBarService.show();
    this.navBarService.activeTabChanged('prizes');
    this.title = 'New Prize';
    this.prize = new Model.Prize({});
    this.editFlag = false;
    this.disableFlag = false;
    this.ktsDeliverySelectSettings = MultiSelectUtil.singleDeliverySelection;
    const id = this.route.snapshot.paramMap.get('prizeId');
    if (id !== null) {
      this.title = 'Edit Prize';
      this.editFlag = true;
      this.disableFlag = true;
      this.getPrize(id);
    }
    this.getSponsors();
    this.getUser();
  }

  getUser() {
    this.currentUserService.getCurrentUser(this.authProvider).then((res: Model.User) => {
      if (res) {
        this.setAdminStatus(res.roles);
        const org = res.organization;
        if (!this.editFlag) {
          this.selectedSponsor.push(new MultiSelectUtil.SelectItem(org.name, this.prize.id));
        }
      }
    }, err => {
      console.log('err', err);
    });
  }

  setAdminStatus(roles: Array<string>): void {
    const filtered = roles.filter(role => {
      if (role === 'admin') { return true; }
    });
    this.ktsSelectSettings = MultiSelectUtil.singleSelection;
    this.ktsSelectSettings.disabled = filtered.length > 0 ? false : true;
  }

  onSponsorSelect(item: any) {
    this.prize.organization_id = item.id;
    this.onChange(item);
  }

  onSponsorDeSelect(item: any) {
    this.onChange(item);
  }

  onDeliverySelect(item: any) {
    this.prize.delivery_type = item.itemName;
    this.onChange(item);
  }

  onDeliveryDeSelect(item: any) {
    this.onChange(item);
  }
  
  goBack(): void {
    this.router.navigate(['prizes']);
  }

  getPrize(id, flag = true): void {
    this.creating = true;
    this.prizesService.getPrize(id).subscribe((res) => {
      this.prize = res;   
      this.originalPrize = Object.assign({}, this.prize);
      if (this.sponsorList.length > 0) {
        let org = this.sponsorList.find(sponsor => sponsor.id === parseInt(this.prize.organization_id, 0));
        if (org) {
          this.selectedSponsor.push(org);
        }
      }
      let delivery = this.deliveryList.find(deliveryType => deliveryType.itemName === this.prize.delivery_type);
      if (delivery) {
        this.selectedDelivery.push(delivery);
      }
      this.creating = false;
      this.disableFlag = flag;
    }, (errors) => {
      this.creating = false;
      alert('Server error');
    });
  }

  onChange(event): void {
    if (this.editFlag) {
      if (this.prize.title !== this.originalPrize.title) {
        this.disableFlag = false;
        return;
      }

      if (this.selectedSponsor.length === 0) {
        this.disableFlag = false;
        return;
      } else if (this.selectedSponsor[0].id !== this.originalPrize.organization_id) {
        this.disableFlag = false;
        return;
      }

      if (this.selectedDelivery.length === 0) {
        this.disableFlag = false;
        return;
      } else if (this.selectedDelivery[0].itemName !== this.originalPrize.delivery_type) {
        this.disableFlag = false;
        return;
      }

      this.disableFlag = true;
    } else {
      this.disableFlag = false;
    }
  }

  savePrize(valid): void {
    if (!valid) {
      return;
    }

    if (this.selectedSponsor.length === 0 || this.selectedDelivery.length === 0) {
      return;
    }

    this.prize.organization_id = this.selectedSponsor[0].id;
    this.creating = true;
    if (!this.prize.id) {
      this.prizesService.createPrize(this.prize).subscribe((res) => {
        this.creating = false;
        alert('Prize is created');
        this.global.selectedTab = 'prizes';
        this.router.navigate(['prizes']);
      }, (errors) => {
        this.creating = false;
        alert('Server error');
      });
    } else {
      this.creating = false;
      alert('Prize is updated');
      this.global.selectedTab = 'prizes';
      this.router.navigate(['prizes']);
      // this.prizesService.updatePrize(this.prize).subscribe( (res) => {      
      //   alert('Prize is updated');  
      //   this.global.selectedTab = 'prizes';
      //   this.router.navigate(['prizes']);       
      // }, (errors) => {      
      //   alert('Server error');
      // });
    }
  }

  getSponsors(): void {
    this.multiSelectService.getDropdownSponsors().subscribe((res: MultiSelectUtil.SelectItem[]) => {
      this.sponsorList = res;
      if (this.editFlag && this.prize.organization_id && this.sponsorList.length > 0) {
        let org = this.sponsorList.find(sponsor => sponsor.id === parseInt(this.prize.organization_id, 0));
        if (org) {
          this.selectedSponsor.push(org);
        }
      }
    }, err => {
      console.log('err', err);
    });
  }
}
