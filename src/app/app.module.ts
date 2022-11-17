import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoleListComponent } from './role/role-list/role-list.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectTypeComponent } from './projectType/project-type/project-type.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BacklogDevelopmentComponent } from './backlogDev/backlog-development/backlog-development.component';
import { UserService } from './user/user.service';
import { AuthGuard } from './auth.guard';
import { LoginAuthService } from './login-auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Toast, ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    RoleListComponent,
    UserListComponent,
    LoginComponent,
    SidebarComponent,
    DashboardComponent,
    ProjectTypeComponent,
    ProjectListComponent,
    BacklogDevelopmentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    TooltipModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true
    })
  ],
  providers: [
    UserService,
    AuthGuard,
    LoginAuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
