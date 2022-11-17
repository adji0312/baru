import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project } from '../project';
import { ProjectService } from '../project.service';
import Swal from 'sweetalert2';
import { Subscription, switchMap, timer } from 'rxjs';
import { LoginAuthService } from 'src/app/login-auth.service';


@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  public projects!: Project[];

  addProjectForm!: FormGroup;
  editProjectForm!: FormGroup;
  currentDate:any = new Date();
  public loginuser: any = {};
  public project: any = {};

  page: number = 1;
  count: number = 0;
  tableSize: number = 8;

  public viewProject: Project = new Project;
  public editProject: Project = new Project;
  public deleteProject: Project = new Project;

  realTimeDataSubscription$!: Subscription;


  constructor(private projectService: ProjectService, private formBuilder: FormBuilder, private authService: LoginAuthService) { 
    this.authService.isLoggedIn();
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
  }

  ngOnInit(): void {

    this.getProjects();

    (response: Project) => {
      console.log(response);
    }
    this.addProjectForm = this.formBuilder.group({
      application: ['', [Validators.required, Validators.maxLength(10)]],
      project_type: ['', [Validators.required, Validators.maxLength(6)]],
      project_bpro: ['', [Validators.required, Validators.maxLength(15)]],
      project_status: ['', [Validators.required, Validators.maxLength(3)]],
      project_desc: ['', [Validators.required, Validators.maxLength(100)]],
      project_kickoff: ['', [Validators.required]]
    })

    this.editProjectForm = this.formBuilder.group({
      application: ['', [Validators.required, Validators.maxLength(10)]],
      project_type: ['', [Validators.required, Validators.maxLength(6)]],
      project_bpro: ['', [Validators.required, Validators.maxLength(15)]],
      project_status: ['', [Validators.required]],
      project_desc: ['', [Validators.required, Validators.maxLength(100)]],
      project_kickoff: ['', [Validators.required]],
    })
  }

  private getProjects(){
    this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.projectService.getProjects(this.loginuser.token)))
      .subscribe(data => {
        this.projects = data;
    });
  }

  onTableDataChange(event: any){
    this.page = event;
    this.getProjects();
  }

  onAddProject(): void {

    if(this.addProjectForm.invalid){
      return;
    }

    this.projectService.addProject(this.addProjectForm.value, this.loginuser.token).subscribe(
      (response: Project) => {
        this.getProjects();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Berhasil menambah Project',
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Gagal menambah Project',
          showConfirmButton: true,
          timer: 1500
        })
      }
    );

    this.addProjectForm.reset();
    document.getElementById('add-project-form')!.click();
  }

  onCloseAddProjectModal(){
    this.addProjectForm.reset();
  }

  onUpdateProject(): void{

    if(this.editProjectForm.invalid){
      return;
    }

    this.projectService.updateProject(this.editProject.id, this.editProjectForm.value, this.loginuser.token).subscribe(
      (response: Project) => {
        this.getProjects();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Berhasil mengupdate Project',
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Gagal mengupdate Project',
          showConfirmButton: true,
          timer: 1500
        })
      }
    )

    document.getElementById('edit-project-form')!.click();
  }

  public onDeleteProject(id: number): void{
    document.getElementById('delete-project')!.click();
    this.projectService.deleteProject(this.deleteProject.id, this.loginuser.token).subscribe(
      (response: void) => {
        this.getProjects();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Berhasil menghapus Project',
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Gagal menghapus Project',
          showConfirmButton: true,
          timer: 1500
        })
      });
  }

  public onOpenModal(project: Project, mode: string): void{
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if(mode === 'add'){
      button.setAttribute('data-target', '#addProjectModal');
    }
    if(mode === 'edit'){
      this.editProject = project;
      button.setAttribute('data-target', '#updateProjectModal');
    }
    if(mode === 'view'){
      this.viewProject = project;
      button.setAttribute('data-target', '#viewProjectModal');
    }
    if(mode === 'delete'){
      this.deleteProject = project;
      button.setAttribute('data-target', '#deleteProjectModal');
    }

    container!.appendChild(button);
    button.click();
  }
}
