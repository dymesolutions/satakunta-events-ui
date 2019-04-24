import { Component, OnInit } from '@angular/core';
import { ReportService } from '@app/services/report.service';

@Component({
  selector: 'app-user-total-count',
  templateUrl: './user-total-count.component.html',
  styleUrls: ['./user-total-count.component.scss']
})
export class UserTotalCountComponent implements OnInit {

  userCount: any;
  loading: boolean;

  constructor(private reportService: ReportService) {
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    this.reportService.getUserCount([])
      .subscribe(result => {
        this.userCount = {
          verifiedUsers: result.users_verified_count
        };
        this.loading = false;
      }, errors => {
        this.loading = false;
      });
  }

}
