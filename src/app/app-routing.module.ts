import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { IndexComponent } from './index/index.component';
import { StockComponent } from './stock/stock.component';

const routes: Routes = [{ path: 'board', component: BoardComponent },
                        { path: 'index', component: IndexComponent },
                        { path: 'stock', component: StockComponent},
                        { path: '', component: IndexComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
