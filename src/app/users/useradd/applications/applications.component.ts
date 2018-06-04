import { Component, OnInit } from '@angular/core';
import { Model } from '../../../app.models-list';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourcesService, UsersService } from '../../../app.services-list';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {
  public user: Model.User;
  public scholarships: Array<Model.Scholarship>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resourcesService: ResourcesService,
    public usersService: UsersService,

  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('userId');
    this.user = new Model.User({});
    this.scholarships = new Array<Model.Scholarship>();
    this.getUser(id);
  }

  getUser(id) {
    this.usersService.getUser(id).subscribe((res) => {
      this.user = res;
      this.scholarships = res.scholarships;
      console.log(res);
    });
  }

  editScholarship(id) {
    this.router.navigate(['scholarshipedit/' + id]);
  }
}
