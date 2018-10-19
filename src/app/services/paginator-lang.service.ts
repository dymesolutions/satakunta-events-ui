import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class PaginatorLangService extends MatPaginatorIntl {

  private translateService: TranslateService;

  itemsPerPageLabel = 'Items per page';
  nextPageLabel = 'Next page';
  previousPageLabel = 'Previous page';

  /**
   * Translate service injected in AppModule
   * @param translateService
   */
  injectTranslateService(translateService: TranslateService) {
    this.translateService = translateService;

    this.translateService.onLangChange.subscribe(() => {
      this.translate();
    });
  }

  private translate() {

  }
}
