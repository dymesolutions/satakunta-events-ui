import { Component, OnInit } from '@angular/core';
import { LoginService } from '@app/services/login.service';

enum CurrentManagePage {
  EVENTS = 1, USERS = 2, KEYWORDS = 3, REPORTS = 4
}

/**
 * Grouping view for management/moderation/admin panels
 */
@Component({
  selector: 'app-manage-panel',
  templateUrl: './manage-panel.component.html',
  styleUrls: ['./manage-panel.component.scss']
})
export class ManagePanelComponent implements OnInit {

  // Controls for showing links
  isAdmin: boolean;
  isStaff: boolean;
  currentManagePage: CurrentManagePage;

  constructor(
    private loginService: LoginService
  ) {
    this.isAdmin = false;
    this.isStaff = false;
    this.currentManagePage = CurrentManagePage.EVENTS;
  }

  openEventsTabs() {
    this.currentManagePage = CurrentManagePage.EVENTS;
  }

  openUsersTabs() {
    this.currentManagePage = CurrentManagePage.USERS;
  }

  openKeywordsTabs() {
    this.currentManagePage = CurrentManagePage.KEYWORDS;
  }

  openReportingTabs() {
    this.currentManagePage = CurrentManagePage.REPORTS;
  }

  ngOnInit() {
    if (this.loginService.user.is_staff || this.loginService.user.is_superuser) {
      // Moderator (staff) view
      this.isStaff = true;
    } else {
      // Basic view
      this.isStaff = false;
      this.isAdmin = false;
    }

    if (this.loginService.user.is_superuser) {
      this.isAdmin = true;
    }
  }
}
