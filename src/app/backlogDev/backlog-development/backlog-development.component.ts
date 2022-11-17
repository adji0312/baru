import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, Form, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription, switchMap, timer } from 'rxjs';
import { LoginAuthService } from 'src/app/login-auth.service';
import { User } from 'src/app/user/user';
import { UserService } from 'src/app/user/user.service';
import Swal from 'sweetalert2';
import { BacklogDevelopmentService } from '../backlog-development.service';
import { BacklogDevelopment } from '../backlogDevelopment';

@Component({
  selector: 'app-backlog-development',
  templateUrl: './backlog-development.component.html',
  styleUrls: ['./backlog-development.component.css']
})

export class BacklogDevelopmentComponent implements OnInit {

  backlogDevs!: BacklogDevelopment[];
  users!: User[];
  

  editBacklogDev: BacklogDevelopment = new BacklogDevelopment;
  viewBacklogDev: BacklogDevelopment = new BacklogDevelopment;
  public loginuser: any = {};
  public backlog: any = {};

  editBacklogDevForm!: FormGroup;

  page: number = 1;
  count: number = 0;
  tableSize: number = 8;

  realTimeDataSubscription$!: Subscription;

  private dateRangeValidator: ValidatorFn = (): { [key: string]: any;} | null => {
    let invalid = false;
    const startDate = this.editBacklogDevForm && this.editBacklogDevForm.get("backlog_start")?.value;
    const endDate = this.editBacklogDevForm && this.editBacklogDevForm.get("backlog_end")?.value;
    if (startDate && endDate) {
      invalid = new Date(startDate).valueOf() > new Date(endDate).valueOf();
    }
    return invalid ? { invalidRange: { startDate, endDate } } : null;
  };

  constructor(
    private backlogDevService: BacklogDevelopmentService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: LoginAuthService
    ) {
      this.authService.isLoggedIn();
      this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
    }

  ngOnInit(): void {
    this.getBacklogDevelopment();
    this.getUsers();

    this.editBacklogDevForm = this.formBuilder.group({
      application: [{value: '', disabled:true}],
      backlog_type: [{value: '', disabled:true}],
      backlog_code: [{value: '', disabled:true}],
      backlog_bpro: [{value: '', disabled:true}],
      backlog_desc: [{value: '', disabled:true}],
      backlog_kickoff: [{value: '', disabled:true}],
      backlog_status: [{value: '', disabled:true}],
      backlog_start: ['', [Validators.required, ]],
      backlog_end: ['', Validators.required],
      pic_PM: ['',],
      pic_Devs: this.formBuilder.array([])
    }, {validators: this.dateRangeValidator});
  }

  private getBacklogDevelopment(){
    // this.realTimeDataSubscription$ = timer(0, 1000)
    // .pipe(switchMap(_ => this.backlogDevService.getBacklogDevelopment()))
    // .subscribe(data => {
    //   this.backlogDevs = data;
    // });

    this.backlogDevService.getAllBacklogDevelopment(this.loginuser.token).subscribe(data => {
      this.backlogDevs = data;
    });
  }

  private getUsers(){
    this.userService.getAllUsers(this.loginuser.token).subscribe(data => {
        this.users = data;
    });
  }

  get backlogDevArray(): FormArray {
      return (<FormArray>this.editBacklogDevForm.get('pic_Devs'));
  }

  onTableDataChange(event: any){
    this.page = event;
    this.getBacklogDevelopment();
  }

  onUpdateBacklogDevelopment(){
    console.log(this.editBacklogDevForm.value);

    // for (let c of this.pic_Devs.controls) {
    //   console.log(c.value);
    // }

    this.backlogDevService.updateBacklogDevelopment(this.editBacklogDev.id, this.editBacklogDevForm.value, this.loginuser.token).subscribe(
      (response: BacklogDevelopment) => {
        this.getBacklogDevelopment();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Berhasil mengupdate Backlog Development',
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Gagal mengupdate Backlog Development',
          showConfirmButton: true,
          timer: 1500
        })
      }
    )
    document.getElementById('edit-backlogDev-form')!.click();
  }

  get pic_Devs(){
    return this.editBacklogDevForm.controls["pic_Devs"] as FormArray;
  }

  addPICDev(){
    this.pic_Devs.push(
      this.formBuilder.group({
        pic_Dev: new FormControl('', [Validators.required])
      })
    );
  }

  removePICDev(idx: number){
    this.pic_Devs.removeAt(idx);
  }

  closeUpdateBacklogDev(){
    this.pic_Devs.controls = [];
  }

  public onOpenModal(backlogDev: BacklogDevelopment, mode: string): void{
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    // if(mode === 'add'){
    //   button.setAttribute('data-target', '#addProjectModal');
    // }
    if(mode === 'edit'){
      this.editBacklogDev = backlogDev;
      console.log(this.editBacklogDev);
      if(this.editBacklogDev.pic_Devs.length < 1){
        this.addPICDev();
      }else{
        this.editBacklogDev.pic_Devs.forEach(element => {
          this.pic_Devs.push(this.formBuilder.group(element));
        });
      }
      button.setAttribute('data-target', '#updateBacklogDevModal');
    }
    if(mode === 'view'){
      this.viewBacklogDev = backlogDev;
      console.log(this.viewBacklogDev.pic_Devs);
      button.setAttribute('data-target', '#viewBacklogDevModal');
    }

    container!.appendChild(button);
    button.click();
  }

}
