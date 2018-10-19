import { PaginatorAction } from '@app/enums/paginator-action';

export interface IPaginatorMessage {
  actionType: PaginatorAction;
  page: number;
  id: string;
}
