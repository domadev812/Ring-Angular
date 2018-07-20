import 'rxjs/add/observable/throw';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Routes, RouterModule, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { error } from 'util';
import { MultiSelectService, PrizesService, CurrentUserService, AuthService, GroupService } from '../../app.services-list';
import { Model } from '../../app.models-list';
import { GlobalState } from '../../global.state';
import { MultiSelectUtil } from '../../_utils/multiselect.util';
import { NavbarService } from '../../app.services-list';
import { Prize } from '../../_models/prize.model';

@Component({
  selector: 'app-prizeadd',
  templateUrl: './prizeadd.component.html',
  styleUrls: ['./prizeadd.component.scss']
})
export class PrizeAddComponent implements OnInit {
  prize: Model.Prize;
  originalPrize: Model.Prize;
  pageTitle: string;
  public editFlag: boolean;
  public disableFlag: boolean;
  public sponsorList = [];
  public selectedSponsor = [];
  public deliveryList = [{ itemName: 'In-House', id: 1 }, { itemName: 'Third Party', id: 2 }];
  public selectedDelivery = [];
  public ktsSelectSettings: MultiSelectUtil.ISelectSettings;
  public selectAllMultiSettings: MultiSelectUtil.ISelectSettings;
  public ktsDeliverySelectSettings = {};
  public creating = false;
  public points: number;
  public groupList = [];
  public selectedGroups = [];
  public limit: number;
  public offset: number;
  public loading = false;
  public group_ids: Array<Model.Group>;
  public groups: Array<Model.Group>;
  public newPrizeId: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private prizesService: PrizesService,
    private multiSelectService: MultiSelectService,
    public global: GlobalState,
    public navBarService: NavbarService,
    private currentUserService: CurrentUserService,
    public authProvider: AuthService,
    private groupService: GroupService,
  ) { }

  ngOnInit() {
    this.navBarService.show();
    this.navBarService.activeTabChanged('prizes');
    this.getSponsors();
    this.pageTitle = 'New Prize';
    this.prize = new Model.Prize({});
    this.originalPrize = new Model.Prize({});
    this.offset = 0;
    this.limit = 50;
    this.editFlag = false;
    this.disableFlag = false;
    this.selectAllMultiSettings = MultiSelectUtil.selectAllMultiSettings();
    this.ktsDeliverySelectSettings = MultiSelectUtil.singleDeliverySelection;
    const id = this.route.snapshot.paramMap.get('prizeId');
    this.getGroups();
    this.getUser();
    if (id) {
      this.pageTitle = 'Edit Prize';
      this.editFlag = true;
      this.disableFlag = true;
      this.getPrize(id);
    }
  }

  getUser() {
    this.currentUserService.getCurrentUser(this.authProvider).then((res: Model.User) => {
      if (res) {
        this.setAdminStatus(res.roles);
        const org = res.organization;
        if (!this.editFlag) {
          this.selectedSponsor.push(new MultiSelectUtil.SelectItem(org.name, res.organization_id));
        }
      }
    }, err => {
      console.log('err', err);
    });
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

  getGroups(): void {
    this.multiSelectService.getDropdownGroups().subscribe((res: MultiSelectUtil.SelectItem[]) => {
      this.groupList = res;
    }, err => {
      console.log('err', err);
    });
  }

  setAdminStatus(roles: Array<string>): void {
    const filtered = roles.filter(role => {
      if (role === 'admin') { return true; }
    });
    this.ktsSelectSettings = MultiSelectUtil.singleSelection();
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

  onGroupSelect(item: any) {
    this.onChange(item);
  }

  onGroupDeSelect(item: any) {
    this.onChange(item);
  }

  goBack(): void {
    this.router.navigate(['prizes']);
  }

  isGroupsChanged(): boolean {
    return this.selectedGroups.length > 0 ? false : true;
  }

  prizeSuccess(prize: Prize) {
    this.creating = false;
    this.prize = prize;
    this.originalPrize = Object.assign({}, prize);
    this.selectedSponsor.push(new MultiSelectUtil.SelectItem(this.prize.organization.name, this.prize.organization_id));
    this.selectedGroups = this.prize.groups.map(group => new MultiSelectUtil.SelectItem(group.name, group.id));
    let delivery = this.deliveryList.find(type => type.itemName.toLowerCase() === this.prize.delivery_type.toLowerCase());
    if (delivery) {
      this.selectedDelivery.push(delivery);
    }
  }

  getPrize(id, flag = true): void {
    this.creating = true;
    this.prizesService.getPrize(id).subscribe((res) => {
      this.prizeSuccess(res);
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
      if (this.selectedGroups.length === 0) {
        this.disableFlag = false;
        return;
      } else if (this.selectedGroups !== this.originalPrize.group_ids) {
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

      if (!this.isGroupsChanged()) {
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

    if (this.selectedGroups.length === 0 || this.selectedGroups.length === 0) {
      return;
    }

    this.prize.group_ids = this.selectedGroups.map(group => {
      return group.id;
    });

    this.prize.organization_id = this.selectedSponsor[0].id;
    if (!this.prize.id) {
      this.prizesService.createPrize(this.prize).subscribe((res) => {
        this.newPrizeId = res.id;
        alert('Prize is created');
        this.global.selectedTab = 'prizes';
        this.router.navigate(['prizeedit/' + this.newPrizeId]);
      }, (errors) => {
        alert('Server error');
      });
    } else {
      this.prizesService.updatePrize(this.prize).subscribe((res) => {
        alert('Prize is updated');
        this.global.selectedTab = 'prizes';
        this.router.navigate(['prizes']);
      }, (errors) => {
        alert('Server error');
      });
    }
  }
}
