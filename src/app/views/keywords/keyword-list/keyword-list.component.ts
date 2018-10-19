import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { KeywordSetService } from '@app/services/keyword-set.service';
import { KeywordService } from '@app/services/keyword.service';
import { PaginatorService } from '@app/services/paginator.service';
import { FormValidationUtil } from '@app/utils/form-validation-util';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-keyword-list',
  templateUrl: './keyword-list.component.html',
  styleUrls: ['./keyword-list.component.scss']
})
export class KeywordListComponent implements OnInit, OnDestroy {

  keywords: any;
  keywordSets: any;

  loadingKeywords: boolean;
  loadingKeywordSets: boolean;

  keywordsPage: number;
  pageSize: number;

  selectedKeywordSetId: string;

  newKeyword: any;

  keywordGroup: FormGroup;
  keywordValidationMsgs: any;

  keywordIdExists: boolean;
  keywordNameExists: boolean;

  private paginatorSub: Subscription;

  constructor(
    private keywordService: KeywordService,
    private keywordSetService: KeywordSetService,
    private paginatorService: PaginatorService,
    private translateService: TranslateService
  ) {
    this.loadingKeywords = false;
    this.loadingKeywordSets = false;

    this.keywordsPage = 1;
    this.pageSize = 15;
    this.newKeyword = {};

    this.keywordGroup = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required)
    });

    this.keywordIdExists = false;
    this.keywordIdExists = false;

    this.keywordValidationMsgs = {};
  }

  ngOnInit() {
    // this.getAllKeywords();
    this.getAllKeywordSets();

    this.paginatorSub = this.paginatorService.paginator.subscribe(message => {
      if (message.id === 'Keywords') {
        this.keywordsPage = message.page;
        this.getAllKeywordsByKeywordSet(this.selectedKeywordSetId);
      } else {

      }
    });

    this.initValidationMessages();
    this.subscribeToEvents();
  }

  ngOnDestroy() {
    this.paginatorSub.unsubscribe();
  }

  private initValidationMessages() {
    this.translateService.get([
      'validations.field_is_required'
    ]).subscribe(msg => {
      this.keywordValidationMsgs = {
        id: [{
          type: 'required',
          message: msg['validations.field_is_required']
        }],
        name: [{
          type: 'required',
          message: msg['validations.field_is_required']
        }]
      };
    });
  }

  private subscribeToEvents() {
    this.keywordGroup.get('id').valueChanges
      .pipe(distinctUntilChanged())
      .pipe(debounceTime(1000))
      .subscribe(id => {
        this.keywordService.exists([{
          id: id
        }]).subscribe(result => {
          this.keywordIdExists = result.exists;
        });
      });

    this.keywordGroup.get('name').valueChanges
      .pipe(distinctUntilChanged())
      .pipe(debounceTime(1000))
      .subscribe(name => {
        this.keywordService.exists([{
          name: name
        }]).subscribe(result => {
          this.keywordNameExists = result.exists;
        });
      });
  }

  private getAllKeywords() {
    this.loadingKeywords = true;
    this.keywordService.getAll([
      { page: this.keywordsPage },
      { page_size: this.pageSize }
    ]).subscribe(keywords => {
      this.keywords = keywords;
      this.loadingKeywords = false;
    });
  }

  private getAllKeywordsByKeywordSet(keywordSetId: string) {
    this.loadingKeywords = true;
    this.keywordService.getAll([
      { page: this.keywordsPage },
      { page_size: this.pageSize },
      { keyword_set: this.selectedKeywordSetId }
    ]).subscribe(keywords => {
      this.keywords = keywords;
      this.loadingKeywords = false;
    }, errors => {
      this.loadingKeywords = false;
    });
  }

  private getAllKeywordSets() {
    this.loadingKeywordSets = true;
    this.keywordSetService.getAll([
      { include: 'keywords' },
      { page: this.keywordsPage },
      { page_size: this.pageSize }
    ]).subscribe(keywordSets => {
      this.keywordSets = keywordSets;
      this.selectedKeywordSetId = this.keywordSets.data[0].id;
      this.loadingKeywordSets = false;
      this.getAllKeywordsByKeywordSet(this.selectedKeywordSetId);
    });
  }

  updateKeywords() {
    this.getAllKeywords();
  }

  addNewKeyword() {

  }

  save() {
    FormValidationUtil.markFormGroupAsTouched(this.keywordGroup);

    if (this.keywordGroup.valid) {
      this.keywordService.save({
        id: this.keywordGroup.get('id').value,
        name: this.keywordGroup.get('name').value,
        keyword_set_id: this.selectedKeywordSetId
      }).subscribe(result => {

      });
    }
  }

  onKeywordSetChanged(event) {
    this.getAllKeywordsByKeywordSet(event.value);
  }

  onTabChanged(event) {  }
}
