import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Person } from '../models/person';
import { Community } from '../models/community';
import { Plot } from '../models/plot';
import { PlotRevision } from '../models/plot_revision';

@Injectable()
export class PersonService {
  huertaskApiUrl = 'http://huertask-dev.herokuapp.com/api';


  COMMUNITIES      = 'communities';
  ACTIVE_COMMUNITY = 'activeCommunity';
  USER             = 'user';
  logged;
  person;
  communities;
  activeCommunity = null;
  isAdmin = false;

  constructor(
    public http: Http,
    public events: Events,
    public storage: Storage
  ) { }

  instanciatedPeople(json): Person[]{
    let people = []
    for(let object in json){
      people.push(this.instanciatedPerson(json[object]))
    }
    return people
  }

  instanciatedPerson(object): Person{
    let person = new Person();
    for(let param in object){
      if(param == 'plot'){
        person[param] = this.instanciatedPlot(object[param])
      }else{
        person[param] = object[param]
      }
    }
    return person
  }

  instanciatedCommunities(json): Community[]{
    let communities = []
    for(let object in json){
      communities.push(this.instanciatedCommunity(json[object]))
    }
    return communities
  }

  instanciatedCommunity(object): Community{
    let community = new Community();
    for(let param in object){
      if(param == 'joined' || param == 'invited'){
        community[param] = this.instanciatedPeople(object[param])
      }else{
        community[param] = object[param]
      }
    }
    return community
  }

  instanciatedPlots(json): Plot[]{
    let plots = []
    for(let object in json){
      plots.push(this.instanciatedPlot(json[object]))
    }
    return plots
  }

  instanciatedPlot(object): Plot{
    let plot = new Plot();
    for(let param in object){
      plot[param] = object[param]
    }
    return plot
  }
  instanciatedPlotRevisions(json): PlotRevision[]{
    let revisions = []
    for(let object in json){
      revisions.push(this.instanciatedPlotRevision(json[object]))
    }
    return revisions
  }

  instanciatedPlotRevision(object): PlotRevision{
    let revision = new PlotRevision();
    for(let param in object){
      revision[param] = object[param]
    }
    return revision
  }

  createCommunity(community): Observable<Community>{
    let token = this.getToken();

    let headers    = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Token', token);
    let options    = new RequestOptions({ headers: headers });

    return this.http.post(`${this.huertaskApiUrl}/communities`, community, options)
                    .map((res:Response) => <Community>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'))
  }

  editCommunity(body: Object): Observable<Community> {
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Token', this.person['token']);

    let options    = new RequestOptions({ headers: headers });

    return this.http.put(`${this.huertaskApiUrl}/communities/${this.activeCommunity['id']}`, body, options)
                    .map((res:Response) => <Community>this.instanciatedCommunity(res.json()))
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  invitePeople(invitations){
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });
    headers.append('Token', this.person['token']);

    return this.http.post(`${this.huertaskApiUrl}/communities/${this.activeCommunity['id']}/invite`, invitations, options)
                    .map((res:Response) => <Community>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'))
  }

  joinCommunity(invitation){
    this.storage.set('invitationCommunity', invitation['community'])

    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });
    headers.append('Token', this.person['token']);

    return this.http.post(`${this.huertaskApiUrl}/communities/${invitation['community']['id']}/join`, {}, options)
                    .map((res:Response) => <Community>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'))
  }

  unjoinCommunity(person_id){
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });
    headers.append('Token', this.person['token']);
    headers.append('Unjoined', person_id);

    return this.http.delete(`${this.huertaskApiUrl}/communities/${this.activeCommunity['id']}/join`, options)
                    .map((res:Response) => <Community>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'))
  }

  toggleAdmin(person_id){
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });
    headers.append('Token', this.person['token']);
    headers.append('Admin-Toggled', person_id);

    return this.http.put(`${this.huertaskApiUrl}/communities/${this.activeCommunity['id']}/join`, {}, options)
                    .map((res:Response) => <Community>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'))
  }

  getCommunity(community_id = this.activeCommunity['id']): Observable<Community> {
    return this.http.get(`${this.huertaskApiUrl}/communities/${community_id}`)
      .map(res => <Community>this.instanciatedCommunity(res.json()));
  }

  getPlots(): Observable<Plot[]> {
    return this.http.get(`${this.huertaskApiUrl}/communities/${this.activeCommunity['id']}/plots`)
      .map(res => <Plot[]>this.instanciatedPlots(res.json()));
  }

  createPlot(body): Observable<Plot>{
    let token = this.getToken();

    let headers    = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Token', token);
    let options    = new RequestOptions({ headers: headers });

    return this.http.post(`${this.huertaskApiUrl}/communities/${this.activeCommunity['id']}/plots/`, body, options)
                    .map((res:Response) => <Plot>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'))
  }

  editPlot(body: Object): Observable<Plot> {
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Token', this.person['token']);

    let options    = new RequestOptions({ headers: headers });

    return this.http.put(`${this.huertaskApiUrl}/plots/${body['id']}`, body, options)
                    .map((res:Response) => <Plot>this.instanciatedPlot(res.json()))
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  deletePlot(plot_id): Observable<any> {
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Token', this.person['token']);
    let options    = new RequestOptions({ headers: headers });

    return this.http.delete(`${this.huertaskApiUrl}/plots/${plot_id}`, options)
                    .map((res:Response) => res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  updateStatus(body): Observable<Community>{
    let token = this.getToken();

    let headers    = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Token', token);
    let options    = new RequestOptions({ headers: headers });

    return this.http.patch(`${this.huertaskApiUrl}/communities/${this.activeCommunity['id']}/plots/status/`, body, options)
                    .map((res:Response) => <Community>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'))
  }

  createRevision(body): Observable<Community>{
    let token = this.getToken();

    let headers    = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Token', token);
    let options    = new RequestOptions({ headers: headers });

    return this.http.post(`${this.huertaskApiUrl}/communities/${this.activeCommunity['id']}/revisions/`, body, options)
                    .map((res:Response) => <Community>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'))
  }

  getPoints(): Observable<any> {
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });
    headers.append('Token', this.person['token']);

    return this.http.get(`${this.huertaskApiUrl}/communities/${this.activeCommunity['id']}/people/${this.person.id}/points`, options)
      .map(res => res.json());
  }

   sendPoint(point){
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });
    headers.append('Token', this.person['token']);

    return this.http.post(`${this.huertaskApiUrl}/communities/${this.activeCommunity['id']}/people/${this.person['id']}/points/donate`, point, options)
                    .map((res:Response) => res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'))
  }

  logIn(person): Observable<Person>{
    this.logged = true
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });

    return this.http.post(`${this.huertaskApiUrl}/login`, person, options)
                    .map((res:Response) => <Person>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  setPerson(person){
    this.person = person
    if(null == this.person['token']){
      this.storage.get(this.USER).then((person) => {
        this.person['token'] = person['token']
      });
    }
    this.communities = person['communities']
    this.events.subscribe('user:login', () => {
      this.storage.set(this.USER, person);
    });
    return new Promise((resolve, reject) => {
      resolve(this.person);
    });
  }

  logOut(){
    this.logged = false
    this.person = null
    this.storage.remove(this.USER);
    // this.events.publish('user:logout');
  }

  signUp(person): Observable<Person>{
    this.logged = true
    this.events.publish('user:signup');
    delete person['terms']
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });

    return this.http.post(`${this.huertaskApiUrl}/signup`, person, options)
                    .map((res:Response) => <Person>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'))
  }

  resetPassword(email){
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });

    return this.http.post(`${this.huertaskApiUrl}/reset_password`, {email: email}, options)
      .map(res => <Person>this.instanciatedPerson(res.json()));
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

  getToken(){
    return this.person ? this.person['token'] : "";
  }

  // return a promise
  getUser(){
    return this.storage.get(this.USER).then((value) => {
      return value;
    });
  };

  setCommunity(community, type){
    let adminType = 2
    this.activeCommunity = community
    this.isAdmin = type == adminType
    this.events.publish('user:login')
  }

  setDefaultCommunity(){
    let adminType = 2
    if(this.person['communities'].length > 0){
      this.activeCommunity = this.person['communities'][0]['community']
      this.isAdmin = this.person['communities'][0]['type'] == adminType
    }

    this.storage.get('invitationCommunity').then((community) => {
      if(null != community){
        this.setCommunity(community, community['type'])
      }
    });

    this.storage.remove('invitationCommunity')

    return new Promise((resolve, reject) => {
      resolve(this.activeCommunity);
    });
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
