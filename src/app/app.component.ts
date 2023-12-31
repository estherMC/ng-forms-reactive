import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

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
    //bind is needed because the method forbiddenNames is calling this and the method will be called by Angular, no the property ts class
      this.signupForm = new FormGroup({
        'userData': new FormGroup({
          'username': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]),
          'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
        }),
        //FormControl --> arguments: first state, single validator, asynchronous validators
        'gender': new FormControl('female'),
        'hobbies': new FormArray([])
      });

      //valueChanges and statuschanges observer to detect any change/the status in the form (can be called in an individual control form)
      // this.signupForm.valueChanges.subscribe(
        // (value) => console.log(value));

      // this.signupForm.statusChanges.subscribe(
      //   (status) => console.log(status));

      this.signupForm.setValue({
        'userData': {
          'username': 'Esther',
          'email': 'esther@test.com',
        },
        'gender': 'male',
        'hobbies': []
      });


      this.signupForm.patchValue({
        'userData': {
          'username': 'Anna'
        },
      });
  }

  onSubmit(){
    console.log(this.signupForm);
    this.signupForm.reset();
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

  forbiddenEmails(control: FormControl): Promise<any> | Observable<any>{
    const promise = new Promise<any>((resolve, reject)=> {
      setTimeout(() => {
        if(control.value === 'test@test.com'){
          resolve({'emailIsForbidden': true});
        }else{
          resolve(null)
        }
      },  1500);
    });
    return promise;
  }


}
