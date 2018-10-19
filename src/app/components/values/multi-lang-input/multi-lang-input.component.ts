import { Component, Input, OnInit } from '@angular/core';
import { ILangSelect } from '@app/interfaces/lang-select';
import { IMultiLangValue } from '@app/interfaces/multilang-value';

@Component({
  selector: 'app-multi-lang-input',
  templateUrl: './multi-lang-input.component.html',
  styleUrls: ['./multi-lang-input.component.scss']
})
export class MultiLangInputComponent implements OnInit {

  @Input() formId: string;
  @Input() inLanguages: ILangSelect;
  @Input() label: string;
  @Input() values: IMultiLangValue;

  constructor() { }

  ngOnInit() {
  }

}
