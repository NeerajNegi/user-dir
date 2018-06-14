import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  
  users: any;
  newUser = {
  	username: '',
  	address: '',
  	contact: '',
  	email: '',
    photo_url:''
  }
  base64textString;
  user: any;
  selectedFile: File = null;
  encodedImage;
  photo_url;
  host_url = environment.host;
  imgur_headers = new Headers({'authorization': 'Client-ID 518c974fc307f31'});

  constructor(public http: HttpClient,
              public snackBar: MatSnackBar) { }

  ngOnInit() {
  	this.http.get(this.host_url + '/api/user/users')
  	.subscribe( (users) => {
  		this.users = users;
  		console.log('Users :', this.users);
  	}, (error) => {
  		console.log('Error Occured');
  	});
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      extraClasses: ['blue-snackbar']
    });
  }

  setPhotoUrl() {
    this.newUser.photo_url = 'https://imgur.com/CiCqQyk.jpg';
  }
  addNewUser() {
  	console.log('New User:', this.newUser);
  	this.http.post(this.host_url +'/api/user/create', this.newUser)
  	.subscribe( (res) => {
  		console.log(res);
      const result:any = res;
  		this.users.unshift(result.user);
      this.openSnackBar('User Added Successfully','');
  	}, (error)=>{
  		console.log(error);
      this.openSnackBar('Error while adding User','');
  	});
    this.newUser = {
      username: '',
      address: '',
      contact: '',
      email: '',
      photo_url:'https://imgur.com/CiCqQyk.jpg'
    }
  }

  deleteUser(id){
    console.log(id);
    const index = this.users.findIndex( user => user._id === id);
    
    this.http.delete(this.host_url + '/api/user/delete/' + id)
    .subscribe( (res) => {
      console.log(res);
      this.users.splice(index, 1);
      this.openSnackBar('User Removed Successfully','');
    }, (error)=>{
      console.log(error);
      this.openSnackBar('Error while removing user','');
    });
  }

  sendUserDetails(i){
    console.log(i);
    this.user = this.users[i];
    console.log(this.user);
  }

  editUser(){
    const index = this.users.findIndex( user => user._id === this.user._id);
    this.http.post(this.host_url + '/api/user/update/' + this.user._id , this.user)
    .subscribe( (res) => {
      console.log(res);
      const result:any = res;
      const updatedUser = result.user;
      this.users[index].username = updatedUser.username;
      this.users[index].address = updatedUser.address;
      this.users[index].contact = updatedUser.contact;
      this.users[index].email = updatedUser.email;
      this.users[index].photo_url = updatedUser.photo_url;
      this.openSnackBar('User Details Updated Successfully','');
      this.user = {
        username: '',
        address: '',
        contact: '',
        email: '',
        photo_url:'https://imgur.com/CiCqQyk.jpg'
      };
    }, (error)=>{
      console.log(error);
      this.openSnackBar('Error while updating user details','');
    });
  }

  handleReaderLoaded(readerEvt) {
     var binaryString = readerEvt.target.result;
     this.base64textString= btoa(binaryString);
  }

  onFileSelected(e){
    this.selectedFile = <File>e.target.files[0];
    console.log('File Selected');
    //console.log(typeof this.selectedFile);

    var reader = new FileReader();
    reader.onload =this.handleReaderLoaded.bind(this);
    reader.readAsBinaryString(this.selectedFile);
  }

  onUpload(flag){
    this.openSnackBar('Uploading Photo...','');
    console.log(this.selectedFile);
    //console.log('Base 64 string: ', this.base64textString);
    if(this.selectedFile) {
      console.log('Uploading File');
      const data = {
        image: this.base64textString,
        type: 'base64'
      }
      this.http.post('https://api.imgur.com/3/upload', data, { headers: {'authorization': 'Client-ID 518c974fc307f31'} })
      .subscribe( (res:any) => {
        console.log(res);
        if (flag === 1) {
          this.user.photo_url = res.data.link;
          console.log('User :', this.user.photo_url);
        } else {
          this.newUser.photo_url = res.data.link;
          console.log('New User :', this.newUser.photo_url);
        }
        this.openSnackBar('Photo Uploaded','');
      }, (error)=>{
        console.log(error);
        this.openSnackBar('Error uploading Photo','');
      });
    } else {
      alert('Select A file first');
    }
  }
}
