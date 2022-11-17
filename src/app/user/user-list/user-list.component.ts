import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
import { Subscription, switchMap, timer } from 'rxjs';
import { LoginAuthService } from 'src/app/login-auth.service';
import { Role } from 'src/app/role/role';
import { RoleService } from 'src/app/role/role.service';
import Swal from 'sweetalert2';
import { User } from '../user';
import { UserService } from '../user.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users!: User[];
  roles!: Role[];
  roleDropdown = null;

  page: number = 1;
  count: number = 0;
  tableSize: number = 8;

  addUserForm!: FormGroup;
  editUserForm!: FormGroup;

  roleID!: number;

  viewUser: User = new User
  editUser: User = new User;
  deleteUser: User = new User;


  public loginuser: any = {};
  public user: any = {};
  

  realTimeDataSubscription$!: Subscription;

  private loadData(){
    // this.getUsers();
    // this.getRoles();
  }

  constructor(private userService: UserService, private roleService: RoleService, private formBuilder: FormBuilder, private authService: LoginAuthService) { 
    this.authService.isLoggedIn();
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
  }

  ngOnInit(): void {

    // this.loadData();
    this.getUsers();
    this.getRoles();

    this.addUserForm = this.formBuilder.group({
      user_id: ['', [Validators.required, Validators.maxLength(10)]],
      user_name: ['', [Validators.required, Validators.maxLength(25)]],
      role: ['', [Validators.required]],
    });

    this.editUserForm = this.formBuilder.group({
      user_id: ['', [Validators.required, Validators.maxLength(10)]],
      user_name: ['', [Validators.required, Validators.maxLength(25)]],
      // role: ['', [Validators.required]],
      role: [''],
    });

    
  }

  get role(){
    return this.editUserForm.get('role') as FormControl;
  }

  private getUsers(){
    this.userService.getAllUsers(this.loginuser.token).subscribe(data => {
      this.users = data;
    })
    // this.realTimeDataSubscription$ = timer(0, 1000)
    //   .pipe(switchMap(_ => this.userService.getAllUsers(this.loginuser.token)))
    //   .subscribe(data => {
    //     this.users = data;
    // });
  }

  private getRoles(){
    this.roleService.getRoles(this.loginuser.token).subscribe(data => {
      this.roles = data;
    })
  }


  onTableDataChange(event: any){
    this.page = event;
    this.getUsers();
  }

  onAddUser(user: User, userForm : any): void {

    if(this.addUserForm.invalid){
      return;
    }
    // this.getRoles();
    this.userService.addUser(this.addUserForm.value, this.loginuser.token).subscribe(
      (response: User) => {
        this.getUsers();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Berhasil menambah User',
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Gagal menambah User',
          showConfirmButton: true,
          timer: 1500
        })
      }
    );

      this.addUserForm.reset();
      for (let name in this.addUserForm.controls) {
        this.addUserForm.controls[name].setErrors(null);
      }
      document.getElementById('add-user-form')!.click();
  }

  onCloseAddUserModal(){
    this.addUserForm.reset();
  }

  onUpdateUser(): void{

    if(this.editUserForm.invalid){
      return;
    }

    // console.log(this.editUserForm.controls["role"].value);

    this.userService.updateUser(this.editUser.id, this.editUserForm.value, this.loginuser.token).subscribe(
      (response: User) => {
        this.getUsers();
        // this.getRoles();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Berhasil mengupdate User',
          showConfirmButton: true,
          timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Gagal mengupdate User',
          showConfirmButton: true,
          timer: 1500
        })
      }
    )
    document.getElementById('edit-user-form')!.click();
  }


  onDeleteUser(id: number): void{
    document.getElementById('delete-user')!.click();
    this.userService.deleteUser(this.deleteUser.id, this.loginuser.token).subscribe(
      (response: void) => {
        console.log(response);
      this.getUsers();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Berhasil menghapus User',
        showConfirmButton: true,
        timer: 1500
      })
    },
    (error: HttpErrorResponse) => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Gagal menghapus User',
        showConfirmButton: true,
        timer: 1500
      })
    });
  }

  public onOpenModal(user: User, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addUserModal');
    }
    if (mode === 'edit') {
      this.editUser = user;
      this.editUserForm.patchValue({
        user_id: this.editUser.user_id,
        user_name: this.editUser.user_name,
        role: this.editUser.role
      });
      button.setAttribute('data-target', '#updateUserModal');
    }
    if (mode === 'view') {
      this.viewUser = user;
      button.setAttribute('data-target', '#viewUserModal');
    }
    if(mode == 'delete'){
      this.deleteUser = user;
      button.setAttribute('data-target', '#deleteUserModal');
    }
    container!.appendChild(button);
    button.click();
  }


}
