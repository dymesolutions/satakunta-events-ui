import { MatDialog } from '@angular/material';
import { PrivacyPolicyDialogComponent } from '@app/views/misc/privacy-policy-dialog/privacy-policy-dialog.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  openPrivacyPolicyDialog() {
    const dialogRef = this.dialog.open(PrivacyPolicyDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
}
