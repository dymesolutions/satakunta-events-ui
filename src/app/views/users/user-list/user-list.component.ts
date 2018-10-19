import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { IFetchUserApiFormat } from '@app/interfaces/fetch-user-api-format';
import { LoginService } from '@app/services/login.service';
import { OrganizationService } from '@app/services/organization.service';
import { UserService } from '@app/services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: MatTableDataSource<IFetchUserApiFormat>;
  organizations: any[];
  displayedColumns: any[];
  loading: boolean;
  userGroup: FormGroup;

  // Search
  searchQuery: string;

  constructor(
    private organizationService: OrganizationService,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
    private translateService: TranslateService,
    private userService: UserService
  ) {
    this.loading = false;
    this.userGroup = new FormGroup({
      organization: new FormControl(),
      isStaff: new FormControl(false),
      isActive: new FormControl(false),
      firstName: new FormControl(''),
      lastName: new FormControl('')
    });

    this.searchQuery = '';
  }

  ngOnInit() {
    this.displayedColumns = ['name', 'username', 'email', 'group', 'is_staff', 'is_active', 'actions'];
    this.getOrganizations();
  }

  private showMessage(message: string) {
    this.translateService.get(['shared.ok']).subscribe(msg => {
      this.snackBar.open(message, msg['shared.ok'], {
        duration: 10000
      });
    });
  }

  private getOrganizations() {
    this.loading = true;
    this.organizationService.getAll().subscribe(
      organizations => {
        this.organizations = organizations.data;
        this.getAllUsers();
      },
      errors => {
        this.translateService.get(['errors.cant_fetch_organizations']).subscribe(msg => {
          this.loading = false;
          this.showMessage(msg['errors.cant_fetch_organizations']);
        });
      }
    );
  }

  private getAllUsers() {
    this.loading = true;
    this.userService.getAll([]).subscribe(
      users => {
        users.data.forEach(user => {
          // Add fields locked property to control disabled form fields
          user.fieldsLocked = true;
        });

        this.users = new MatTableDataSource(users.data);

        this.loading = false;
      },
      errors => {
        this.loading = false;
        this.translateService.get(['errors.cant_fetch_users']).subscribe(msg => {
          this.showMessage(msg['errors.cant_fetch_users']);
        });
      }
    );
  }

  unlockFields(user: any) {
    user.fieldsLocked = false;
  }

  lockFields(user: any) {
    user.fieldsLocked = true;
  }

  onChangeOrganization(event, user: IFetchUserApiFormat) {}

  toggleActive(user: IFetchUserApiFormat) {}

  toggleRole(user: IFetchUserApiFormat) {}

  updateUserList() {
    // this.getOrganizations();
    this.getAllUsers();
  }

  save(user) {
    this.loading = true;
    this.userService.update(user).subscribe(
      result => {
        this.loading = false;
        this.translateService.get(['users.user_updated_successfully']).subscribe(msg => {
          this.showMessage(msg['users.user_updated_successfully']);
        });
      },
      errors => {
        this.loading = false;
      }
    );
  }

  search() {
    this.loading = true;
    this.userService
      .getAll([
        {
          text: this.searchQuery
        }
      ])
      .subscribe(
        users => {
          users.data.forEach(user => {
            // Add fields locked property to control disabled form fields
            user.fieldsLocked = true;
          });

          this.users = new MatTableDataSource(users.data);
          this.loading = false;
        },
        errors => {
          this.loading = false;
        }
      );
  }
}
