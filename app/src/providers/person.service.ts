import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Person } from '../models/person';

@Injectable()
export class PersonService {
  huertaskApiUrl = 'http://huertask-dev.herokuapp.com/api';

  logged;
  person;

  constructor(public http: Http) { }

  instanciatedPerson(object): Person{
    let person = new Person();
    for(let param in object){
      person[param] = object[param]
    }
    return person
  }

  logIn(person): Observable<Person>{
    this.logged = true
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });

    person = this.http.post(`${this.huertaskApiUrl}/login`, person, options)
                    .map((res:Response) => <Person>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
    return person
  }

  logOut(): Observable<Person>{
    this.logged = false
    return this.http.get(`${this.huertaskApiUrl}/logout`)
      .map(res => <Person>res.json());
  }

  signUp(person): Observable<Person>{
    this.logged = true
    delete person['terms']
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });

    return this.http.post(`${this.huertaskApiUrl}/signup`, person, options)
                    .map((res:Response) => <Person>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'))
  }

  getPerson(id): Observable<Person> {
    return this.http.get(`${this.huertaskApiUrl}/people/${id}`)
      .map(res => <Person>this.instanciatedPerson(res.json()));
  }

  toggleLikeCategory(user, category){
    if (category.fav){
      return this.dislikeCategory(user.id, category.id)
    } else {
      return this.likeCategory(user.id, category.id)
    }
  }

  likeCategory(user_id, category_id): Observable<Person> {
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });

    return this.http.post(`${this.huertaskApiUrl}/people/${user_id}/categories/${category_id}`, "", options)
                    .map((res:Response) => <Person>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  dislikeCategory(user_id, category_id): Observable<Person> {
    return this.http.delete(`${this.huertaskApiUrl}/people/${user_id}/categories/${category_id}`)
                    .map((res:Response) => <Person>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }
}

@Injectable()
export class PersonServiceMock {
  person;
  json = {
    "id": 1,
    "name": "Persona 1",
    "categories": []
  }

  constructor(){
    this.person = this.instanciatedPerson(this.json);
  }

  instanciatedPerson(object): Person{
    let person = new Person();
    for(let param in object){
      person[param] = object[param]
    }
    return person
  }

  getPerson(id): Observable<Person> {
    return Observable.of(this.person);
  }
}
