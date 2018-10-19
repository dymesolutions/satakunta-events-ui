import { Component, OnInit } from '@angular/core';
import { KeywordSetService } from '@app/services/keyword-set.service';

@Component({
  selector: 'app-keyword-set-list',
  templateUrl: './keyword-set-list.component.html',
  styleUrls: ['./keyword-set-list.component.scss']
})
export class KeywordSetListComponent implements OnInit {

  constructor(
    private keywordSetService: KeywordSetService
  ) { }

  ngOnInit() {
  }

  private getAll() {

  }
}
