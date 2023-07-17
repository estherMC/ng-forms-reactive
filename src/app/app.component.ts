import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  signupForm: FormGroup;
  forbiddenUsernames = ['Chris', 'Anna'];

  ngOnInit(): void {
    //bind is needed because the method forbiddenNames will be called by Angular, no the property ts class
      this.signupForm = new FormGroup({
        'userData': new FormGroup({
          'username': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]),
          'email': new FormControl(null, [Validators.required, Validators.email]),
        }),
        //FormControl --> arguments: first state, single validator, asynchronous validators
        'gender': new FormControl('female'),
        'hobbies': new FormArray([])
      });
  }

  onSubmit(){
    console.log(this.signupForm);
  }

  onAddHobby(){
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control);
  }

  getControls(){
    return (<FormArray>this.signupForm.get('hobbies')).controls;
  }

  //Alternative to getControls() --> without casting and in html use directly controls instead of getControls():
  // get controls() {
  //   return (this.signupForm.get('hobbies') as FormArray).controls;
  // }

  forbiddenNames(control: FormControl): {[s: string]: boolean} {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1){
      return {'nameIsForbidden' : true};
    }
    //Not {'nameIsForbidden' : false  } --> to tell Angular is invalid, we should send null
    return null;
  }


}
