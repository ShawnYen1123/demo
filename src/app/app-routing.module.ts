import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { IndexComponent } from './index/index.component';
import { StockComponent } from './stock/stock.component';
import { CdkeyComponent } from './cdkey/cdkey.component';


const routes: Routes =
  [{ path: 'board', component: BoardComponent },
  { path: 'cdkey', component: CdkeyComponent },
  { path: 'index', component: IndexComponent },
  { path: 'stock', component: StockComponent },
  { path: 'cdkey', component: CdkeyComponent },
  { path: '', component: IndexComponent },
  { path: '**', component: IndexComponent }];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
