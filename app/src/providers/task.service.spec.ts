import { async, inject, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { TaskService } from './task.service';

describe('TaskService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService
      ],
      imports: [
        HttpModule
      ]
    });
  });

  it('should construct', async(inject([TaskService], (service) => {
    expect(service).toBeDefined();
  })));

  it('should get a list of future tasks', async(inject([TaskService], (service) => {
    service.getFutureTasks().subscribe(tasks => {
      var pastTasks = tasks.filter(function(e){ return Date.parse(e.from_date) <= Date.now()});
      expect(pastTasks.length).toEqual(0);
    });
  })));

  it('should get a list of past tasks', async(inject([TaskService], (service) => {
    service.getPastTasks().subscribe(tasks => {
      var futureTasks = tasks.filter(function(e){ return Date.parse(e.from_date) > Date.now()});
      expect(futureTasks.length).toEqual(0);
    });
  })));

  it('should create a new task', async(inject([TaskService], (service) => {
    var newTask = {title: 'Tarea creada por test', from_date: '2020-01-10T13:00:00+00:00', people: 1, category: '5'};
    service.createTask(newTask).subscribe(task => {
      expect(task.id).not.toBe(null);
    });
  })));

});
