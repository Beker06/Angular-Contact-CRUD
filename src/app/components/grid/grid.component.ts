import { Component, effect, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { FilterComponent } from "./filter/filter.component";
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { APP_CONTACTS } from '@shared/constants';
import { ContactService } from '@features/contacts/contact.service';
import { ModalService } from '@components/modal/modal.service';
import { ModalComponent } from '@components/modal/modal.component';
import { SnackBarService } from '@shared/services/snack-bar.service';

const MATERIAL_MODULES = [MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, MatButtonModule]

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [MATERIAL_MODULES, FilterComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent<T> implements OnInit{
  displayedColumns = input.required<string[]>();
  data = input.required<T[]>()
  sortableColumns = input<string[]>([])

  dataSource = new MatTableDataSource<T>();
  valueToFilter = signal('')
  private readonly _sort = viewChild.required<MatSort>(MatSort)
  private readonly _paginator = viewChild.required<MatPaginator>(MatPaginator)
  private  readonly _contactSvc = inject(ContactService);
  private readonly _modalSvc = inject(ModalService);
  private readonly _snackBar = inject(SnackBarService);

  constructor() {
    effect(() => {
      if(this.valueToFilter()){
        this.dataSource.filter = this.valueToFilter()
      }

      if(this.data()){
        this.dataSource.data = this.data()
      }
    }, {allowSignalWrites: true})
  }

  ngOnInit(): void {
    this.dataSource.data = this.data();
    this.dataSource.sort = this._sort();
    this.dataSource.paginator = this._paginator();
  }

  openEditForm(data: T){
    this._modalSvc.openModal<ModalComponent, T>(ModalComponent, data, true)
  }

  selectedRow(data: T){
    this.openEditForm(data)
  }


  deleteContact(id:string): void{
    const confirmation = confirm(APP_CONTACTS.MESSAGES.CONFIRMATION_PROMPT)
    if(confirmation){
      this._contactSvc.deleteContact(id);
      this._snackBar.showSnackBar(APP_CONTACTS.MESSAGES.CONTACT_DELETED)
    }
  }

}
