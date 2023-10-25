import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewDocComponent } from './components/new-doc/new-doc.component';
import { WorkspaceComponent } from './pages/workspace/workspace.component';

@NgModule({
  declarations: [
    AppComponent,
    NewDocComponent,
    WorkspaceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
