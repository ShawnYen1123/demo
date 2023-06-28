import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { IndexComponent } from './index/index.component';

const routes: Routes = [{ path: 'board', component: BoardComponent },
                        { path: 'index', component: IndexComponent },
                        { path: '', component: IndexComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
