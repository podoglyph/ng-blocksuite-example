import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { WorkspaceComponent } from './pages/workspace/workspace.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    pathMatch: 'full',
  },
  {
    path: 'doc/:id',
    component: WorkspaceComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
