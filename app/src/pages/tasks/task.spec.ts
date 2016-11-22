import { ComponentFixture, async } from '@angular/core/testing';
import { TestUtils }               from '../../test';
import { Tasks }          from './tasks';

let fixture: ComponentFixture<Tasks> = null;
let instance: any = null;
let tabName: string;

describe('Pages: Tasks', () => {

  beforeEach(async(() => TestUtils.beforeEachCompiler([Tasks]).then(compiled => {
    fixture = compiled.fixture;
    instance = compiled.instance;
  })));

  it('should create the task page', async(() => {
    expect(instance).toBeTruthy();
  }));

  it('should has a tasks list', async(() => {
    expect(instance.list).toBeTruthy();
  }));

  it('should filter tasks when select a tab', async(() => {
    tabName = "TASKS.PREVIOUS";
    instance.showTasks(tabName);
    fixture.detectChanges();
    let element = fixture.nativeElement;
    let nodeList = element.querySelectorAll('.from-date');
    let fromDates = Array.prototype.slice.call(nodeList);

    expect(fromDates.length).toBe(3);

    tabName = "TASKS.NEXT";
    instance.showTasks(tabName);
    fixture.detectChanges();
    element = fixture.nativeElement;
    nodeList = element.querySelectorAll('.from-date');
    fromDates = Array.prototype.slice.call(nodeList);

    expect(fromDates.length).toBe(3);
  }));
});
