import { ComponentFixture, async } from '@angular/core/testing';
import { TestUtils }               from '../../test';
import { TaskDetail }             from './task-detail';


let fixture: ComponentFixture<TaskDetail> = null;
let instance: any = null;

describe('Pages: Task Detail', () => {

  beforeEach(async(() => TestUtils.beforeEachCompiler([TaskDetail]).then(compiled => {
    fixture = compiled.fixture;
    instance = compiled.instance;
  })));

  it('should create the task detail page', async(() => {
    expect(instance).toBeTruthy();
  }));

  it('should show task info at task detail page', async(() => {
    let template = fixture.nativeElement;
    fixture.detectChanges();

    let title = template.getElementsByTagName('h1')[0].innerText;
    expect(title).toBe('Tarea numero 3');

    let nodeList = template.querySelectorAll('span.category');
    let categories = Array.prototype.slice.call(nodeList);

    expect(categories.length).toBe(1)
    expect(categories[0].innerText).toBe('carpinteria')
  }));
});
