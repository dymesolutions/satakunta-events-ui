import { Component, OnInit } from '@angular/core';
import { IFetchOrganizationApiFormat } from '@app/interfaces/fetch-organization-api-format';
import { OrganizationService } from '@app/services/organization.service';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss']
})
export class OrganizationListComponent implements OnInit {

  organizations: IFetchOrganizationApiFormat;

  constructor(
    private organizationService: OrganizationService
  ) { }

  ngOnInit() {
    this.getAllOrganizations();
  }

  private getAllOrganizations() {
    this.organizationService.getAll()
    .subscribe(organizations => {
      this.organizations = organizations;
    });
  }
}
