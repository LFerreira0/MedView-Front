import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {DomSanitizer} from "@angular/platform-browser";
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit{
  latitude!: number;
  longitude!: number;
  position!: string;
  sidebarVisible: boolean = false;
  buttonVisible: boolean = true;
  userName!: string;
  email!: string;
  logged = false;
  settings = false;
  token !: string;

  public loginForm = new FormGroup({
    email: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
  })

  public creationMessage!: string;
  public newUserForm = new FormGroup({
    name: new FormControl("", Validators.required),
    creatEmail: new FormControl("", Validators.required),
    createPassword: new FormControl("", Validators.required),
  })


  constructor(private sanitizer: DomSanitizer, private http : HttpClient){}

  ngOnInit() {
    this.getLocation();

  }

  getLocation(): void{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
          this.latitude = position.coords.longitude;
          this.latitude = position.coords.latitude;
          this.position = `https://maps.google.com/maps?q=${this.latitude},${this.longitude}&hl=es;z=14&amp;output=embed`

        });
    } else {
       console.log("No support for geolocation")
    }
  }

  public defineUser(){
    const user = {
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value,
    }

    this.loginUser(user)

  }

  public loginUser(user:any){
    this.http.post(`${ environment.apiUrl }/sessions`, user)
    .subscribe((result : any) => {
        this.sidebarVisible = false;
        this.buttonVisible = false;
        this.logged = true;
        this.token = user.token;
        this.userName = result.user.name.split(' ');
        this.userName = this.userName[0];
        this.email = result.user.email;
    })
  }



  public createUser (){
    const user = {
      name: this.newUserForm.controls['name'].value,
      email: this.newUserForm.controls['creatEmail'].value,
      password: this.newUserForm.controls['createPassword'].value,
    }

    this.http.post(`${ environment.apiUrl }/users`, user)
    .subscribe((result : any) => {
        this.newUserForm.reset();
        this.creationMessage = result.message;

        setTimeout(() => {
          this.creationMessage = '';
          this.loginUser(user);
        }, 3000);
    })
  }

  public logout() {
    this.logged = false;
    this.settings = false;
    this.buttonVisible = true;
    this.token = '';
  }

}
