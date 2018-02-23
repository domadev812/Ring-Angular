import 'rxjs/add/observable/throw';
import { Component, OnInit, TemplateRef} from '@angular/core';
import { ActivatedRoute, Routes, RouterModule } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { error } from 'util';
import { PrizesService } from '../../app.services-list';
import { Model } from '../../app.models-list';

@Component({
  selector: 'app-prizeadd',
  templateUrl: './prizeadd.component.html',
  styleUrls: ['./prizeadd.component.scss']
})
export class PrizeAddComponent implements OnInit { 
  prize: Model.Prize; 
  title: string;
  constructor(private route: ActivatedRoute, private prizesService: PrizesService) {
  }
  ngOnInit() { 
    this.title = 'New Prize';
    this.prize = new Model.Prize({});    
    this.prize.id = this.route.snapshot.paramMap.get('prizeid');      
    if (this.prize.id !== null) {
      this.title = 'Edit Prize';
      this.getPrize();
    }
  }

  getPrize(): void {
    this.prizesService.getPrize(this.prize.id).subscribe( (res) => {                 
      this.prize.setData(res);         
    }, (errors) => {      
      alert('Server error');
    });
  }

  savePrize(event): void {        
    if (!this.prize.title || this.prize.title === '') {
      alert('Please input prize name');
      return;
    }
    if (this.prize.id === null) {      
      this.prizesService.createPrize(this.prize).subscribe( (res) => {  
        this.prize = res;        
        alert('Prize is created');         
      }, (errors) => {      
        alert('Server error');
      });
    } else {      
      this.prizesService.updatePrize(this.prize).subscribe( (res) => {      
        alert('Prize is updated');         
      }, (errors) => {      
        alert('Server error');
      });
    }
  }
}
