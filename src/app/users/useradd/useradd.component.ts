import 'rxjs/add/observable/throw';
import { Component, OnInit, TemplateRef} from '@angular/core';
import { ActivatedRoute, Routes, RouterModule, Router } from '@angular/router';
import { error } from 'util';
import { MultiSelectService, UsersService } from '../../app.services-list';
import { Model } from '../../app.models-list';
import { MultiSelectUtil } from '../../_utils/multiselect.util';

@Component({
  selector: 'app-useradd',
  templateUrl: './useradd.component.html',
  styleUrls: ['./useradd.component.scss']
})
export class UserAddComponent implements OnInit { 
  newUser: Model.User; 
  originalUser: Model.User;
  title: string;
  public editFlag: boolean;
  public disableFlag: boolean;
  public schoolList = [];
  public selectedSchool = [];
  public typeList = [];
  public selectedType = [];
  public ktsSelectSettings = {};

  constructor(private route: ActivatedRoute, 
              private router: Router,
              private usersService: UsersService,
              private multiSelectService: MultiSelectService) { }

  ngOnInit() { 
    this.title = 'New User';
    this.newUser = new Model.User({});        
    this.editFlag = false;
    this.disableFlag = false;
    this.ktsSelectSettings = MultiSelectUtil.singleSelection;    
    this.typeList.push({itemName: 'Student', id: 'student'});
    this.typeList.push({itemName: 'Key Contact', id: 'key_contact'});
    this.typeList.push({itemName: 'Counselor', id: 'counselor'});
    this.typeList.push({itemName: 'Business Owner', id: 'business_owner'});

    const id = this.route.snapshot.paramMap.get('userId');
    if (id !== null) {
      this.title = 'Edit User';
      this.editFlag = true;
      this.disableFlag = true;
      this.getUser(id);
    }
    this.getSchools();
  }

  onSchoolSelect(item: any) {
    this.newUser.organization_id = item.id;    
    this.onChange(item);
  }

  onSchoolDeSelect(item: any) {
    this.onChange(item);
  }

  onTypeSelect(item: any) {
    this.newUser.type = item.id;    
    this.onChange(item);
  }

  onTypeDeSelect(item: any) {
    this.onChange(item);
  }

  goBack(event): void {
    this.router.navigate(['users']);
  }

  getUser(id): void {
    // this.prizesService.getPrize(id).subscribe( (res) => {          
    //   this.prize = res;
    //   this.prize.details = 'Detail';
    //   this.prize.sponsor_id = '1212';
    //   this.prize.delivery_type = 'Third Party';
    //   this.originalPrize = Object.assign({}, this.prize);
    //   if (this.sponsorList.length > 0) {
    //     let org = this.sponsorList.find(sponsor => sponsor.id === parseInt(this.prize.sponsor_id, 0));
    //     if (org) {
    //       this.selectedSponsor.push(org);
    //     }
    //   }
    //   let delivery = this.deliveryList.find(deliveryType => deliveryType.itemName === this.prize.delivery_type);
    //   if (delivery) {
    //     this.selectedDelivery.push(delivery);
    //   }
    // }, (errors) => {      
    //   alert('Server error');
    // });
  }

  onChange(event): void {
    // if (this.editFlag) {      
    //   if (this.prize.title !== this.originalPrize.title) {
    //     this.disableFlag = false;
    //     return;
    //   }      
      
    //   if (this.prize.details !== this.originalPrize.details) {
    //     this.disableFlag = false;
    //     return;
    //   }
      
    //   if (this.selectedSponsor.length === 0) {
    //     this.disableFlag = false;        
    //     return;
    //   } else if (this.selectedSponsor[0].id !== this.originalPrize.sponsor_id) {
    //     this.disableFlag = false;        
    //     return;
    //   }
      
    //   if (this.selectedDelivery.length === 0) {
    //     this.disableFlag = false;
    //     return;
    //   } else if (this.selectedDelivery[0].itemName !== this.originalPrize.delivery_type) {
    //     this.disableFlag = false;
    //     return;
    //   }
      
    //   this.disableFlag = true;
    // } else {
    //   this.disableFlag = false;
    // }
  }

  saveUser(valid): void { 
    // if (!valid) {
    //   return;
    // } 
    
    // if (this.selectedSponsor.length === 0 || this.selectedDelivery.length === 0) {
    //   return;
    // }    
    
    // if (!this.prize.id) {      
    //   this.prizesService.createPrize(this.prize).subscribe( (res) => {            
    //     alert('Prize is created');  
    //     this.global.selectedTab = 'prizes';
    //     this.router.navigate(['prizes']);       
    //   }, (errors) => {      
    //     alert('Server error');
    //   });
    // } else {            
    //   alert('Prize is updated'); 
    //   this.global.selectedTab = 'prizes';
    //   this.router.navigate(['prizes']);  
    // }
  }

  getSchools(): void {
    this.multiSelectService.getDropdownSchools().subscribe((res: MultiSelectUtil.SelectItem[]) => {
      this.schoolList = res;      
      if (this.editFlag && this.newUser.organization_id && this.schoolList.length > 0) {        
        let org = this.schoolList.find(organization => organization.id === parseInt(this.newUser.organization_id, 0));                
        if (org) {
          this.selectedSchool.push(org);
        }
      }
    }, err => {
      console.log('err', err);
    });
  }

  validEmail(): boolean {
    return true;
  }
}
