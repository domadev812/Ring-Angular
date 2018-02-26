import 'rxjs/add/observable/throw';
import { Component, OnInit, TemplateRef} from '@angular/core';
import { ActivatedRoute, Routes, RouterModule, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { error } from 'util';
import { MultiSelectService, PrizesService } from '../../../app.services-list';
import { Model } from '../../../app.models-list';
import { GlobalState } from '../../../global.state';
import { MultiSelectUtil } from '../../../_utils/multiselect.util';

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
  public deliveryList = [{itemName: 'In-House', id: 1}, {itemName: 'Third Party', id: 2}];
  public selectedDelivery = [];
  public ktsSelectSettings = {};

  constructor(private route: ActivatedRoute, 
              private router: Router,
              private prizesService: PrizesService,
              private multiSelectService: MultiSelectService,
              public global: GlobalState) { }

  ngOnInit() { 
    this.title = 'New Prize';
    this.prize = new Model.Prize({});        
    this.editFlag = false;
    this.disableFlag = false;
    this.ktsSelectSettings = MultiSelectUtil.singleSelection;    
    const id = this.route.snapshot.paramMap.get('prizeId');
    if (id !== null) {
      this.title = 'Edit Prize';
      this.editFlag = true;
      this.disableFlag = true;
      this.getPrize(id);
    }
    this.getSponsors();
  }

  onSponsorSelect(item: any) {
    this.prize.sponsor_id = item.id;    
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
  goBack(event): void {
    this.router.navigate(['prizes']);
  }

  getPrize(id): void {
    this.prizesService.getPrize(id).subscribe( (res) => {          
      this.prize = res;
      this.prize.details = 'Detail';
      this.prize.sponsor_id = '1212';
      this.prize.delivery_type = 'Third Party';
      this.originalPrize = Object.assign({}, this.prize);
      if (this.sponsorList.length > 0) {
        let org = this.sponsorList.find(sponsor => sponsor.id === parseInt(this.prize.sponsor_id, 0));
        if (org) {
          this.selectedSponsor.push(org);
        }
      }
      let delivery = this.deliveryList.find(deliveryType => deliveryType.itemName === this.prize.delivery_type);
      if (delivery) {
        this.selectedDelivery.push(delivery);
      }
    }, (errors) => {      
      alert('Server error');
    });
  }

  onChange(event): void {
    if (this.editFlag) {      
      if (this.prize.title !== this.originalPrize.title) {
        this.disableFlag = false;
        return;
      }      
      if (this.prize.details !== this.originalPrize.details) {
        this.disableFlag = false;
        return;
      }

      if (this.selectedSponsor.length === 0) {
        this.disableFlag = false;
        return;
      } else if (this.selectedSponsor[0].id !== this.originalPrize.sponsor_id) {
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
    
    if (!this.prize.id) {      
      this.prizesService.createPrize(this.prize).subscribe( (res) => {            
        alert('Prize is created');  
        this.global.selectedTab = 'prizes';
        this.router.navigate(['prizes']);       
      }, (errors) => {      
        alert('Server error');
      });
    } else {            
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
      if (this.editFlag && this.prize.sponsor_id && this.sponsorList.length > 0) {        
        let org = this.sponsorList.find(sponsor => sponsor.id === parseInt(this.prize.sponsor_id, 0));                
        if (org) {
          this.selectedSponsor.push(org);
        }
      }
    }, err => {
      console.log('err', err);
    });
  }
}
