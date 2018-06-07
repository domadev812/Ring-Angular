import { Component, OnInit } from '@angular/core';
import { Model } from '../../../app.models-list';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourcesService, UsersService } from '../../../app.services-list';

@Component({
  selector: 'app-useropportunities',
  templateUrl: './useropportunities.component.html',
  styleUrls: ['./useropportunities.component.scss']
})
export class UseropportunitiesComponent implements OnInit {
  public user: Model.User;
  public opportunities: Array<Model.Resource>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resourcesService: ResourcesService,
    public usersService: UsersService,
  ) { }


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('userId');
    this.user = new Model.User({});
    this.opportunities = new Array<Model.Resource>();
    this.getUser(id);
  }

  getUser(id) {
    this.usersService.getUser(id).subscribe((res) => {
      this.user = res;
      this.opportunities = res.opportunities;
      console.log(res);
    });
  }

  editOpportunity(id) {
    this.router.navigate(['opportunityedit/' + id]);
  }
}
