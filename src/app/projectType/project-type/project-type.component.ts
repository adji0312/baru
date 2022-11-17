import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, switchMap, timer } from 'rxjs';
import { LoginAuthService } from 'src/app/login-auth.service';
import Swal from 'sweetalert2';
import { ProjectTypeService } from '../project-type.service';
import { ProjectType } from '../projectType';

@Component({
  selector: 'app-project-type',
  templateUrl: './project-type.component.html',
  styleUrls: ['./project-type.component.css']
})
export class ProjectTypeComponent implements OnInit {

  projectTypes!: ProjectType[];
  addProjectTypeForm!: FormGroup;
  editProjectTypeForm!: FormGroup;

  editProjectType: ProjectType = new ProjectType;
  deleteProjectType: ProjectType = new ProjectType;
  viewProjectType: ProjectType = new ProjectType;
  public loginuser: any = {};
  public projectType: any = {};

  page: number = 1;
  count: number = 0;
  tableSize: number = 8;

  realTimeDataSubscription$!: Subscription;

  constructor(private projectTypeService: ProjectTypeService, private formBuilder: FormBuilder, private authService: LoginAuthService) {
    this.authService.isLoggedIn();
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
   }

  ngOnInit(): void {
    this.getProjectTypes();

    this.addProjectTypeForm = this.formBuilder.group({
      application: ['', [Validators.required, Validators.maxLength(10)]],
      project_type: ['', [Validators.required, Validators.maxLength(6)]],
      project_desc: ['', [Validators.required, Validators.maxLength(60)]]
    })

    this.editProjectTypeForm = this.formBuilder.group({
      application: ['', [Validators.required, Validators.maxLength(10)]],
      project_type: ['', [Validators.required, Validators.maxLength(6)]],
      project_desc: ['', [Validators.required, Validators.maxLength(60)]]
    })
  }

  private getProjectTypes(){

    this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.projectTypeService.getProjectTypes(this.loginuser.token)))
      .subscribe(data => {
        this.projectTypes = data;
    });
  }

  onTableDataChange(event: any){
    this.page = event;
    this.getProjectTypes();
  }

  onAddProjectType(){

    if(this.addProjectTypeForm.invalid){
      return;
    }

    this.projectTypeService.addProjectType(this.addProjectTypeForm.value, this.loginuser.token).subscribe(
      (response: ProjectType) => {
        this.getProjectTypes();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Berhasil menambah Project Type',
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Gagal menambah Project Type',
          showConfirmButton: true,
          timer: 1500
        })
      });

      document.getElementById('add-projectType-form')!.click();
      this.addProjectTypeForm.reset();
  }

  closeAddProjectTypeModal(){
    this.addProjectTypeForm.reset();
  }

  onEditProjectType(){

    if(this.editProjectTypeForm.invalid){
      return;
    }

    this.projectTypeService.updateProjectType(this.editProjectType.id, this.editProjectTypeForm.value, this.loginuser.token).subscribe(
      (response: ProjectType) => {
        this.getProjectTypes();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Berhasil mengupdate Project Type',
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Gagal mengupdate Project Type',
          showConfirmButton: true,
          timer: 1500
        })
      });

      document.getElementById('edit-projectType-form')!.click();
  }

  onDeleteUser(id:number): void{
    document.getElementById('delete-projectType')!.click();
    this.projectTypeService.deleteProjectType(this.deleteProjectType.id, this.loginuser.token).subscribe(
      (response: void) => {
      console.log(response);
      this.getProjectTypes();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Berhasil menghapus Project Type',
        showConfirmButton: true,
        timer: 1500
      })
    },
    (error: HttpErrorResponse) => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Gagal menghapus Project Type',
        showConfirmButton: true,
        timer: 1500
      })
    });
  }

  onOpenModal(projectType: ProjectType, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addProjectTypeModal');
    }
    if (mode === 'edit') {
      this.editProjectType = projectType;
      button.setAttribute('data-target', '#updateProjectTypeModal');
    }
    if(mode == 'delete'){
      this.deleteProjectType = projectType;
      button.setAttribute('data-target', '#deleteProjectTypeModal');
    }
    if(mode == 'view'){
      this.viewProjectType = projectType;
      button.setAttribute('data-target', '#viewProjectTypeModal');
    }
    container!.appendChild(button);
    button.click();
  }

}
