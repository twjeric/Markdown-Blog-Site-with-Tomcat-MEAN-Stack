import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { EditComponent } from './edit/edit.component';
import { PreviewComponent } from './preview/preview.component';
import { PageNotFoundComponent } from './not-found.component';

import { CanDeactivateGuard }    from './can-deactivate-guard.service';

const routes: Routes = [
  { path: 'edit/:id', component: EditComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'preview/:id', component: PreviewComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {useHash: true})
  ],
  exports: [ RouterModule ],
  providers: [
    CanDeactivateGuard
  ],
  declarations: []
})
export class AppRoutingModule { }
