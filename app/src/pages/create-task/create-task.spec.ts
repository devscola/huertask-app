import { ComponentFixture, async } from '@angular/core/testing';
import { TestUtils }               from '../../test';
import { CreateTask }             from './create-task';


let fixture: ComponentFixture<CreateTask> = null;
let instance: any = null;

describe('Pages: Create Task', () => {

  beforeEach(async(() => TestUtils.beforeEachCompiler([CreateTask]).then(compiled => {
    fixture = compiled.fixture;
    instance = compiled.instance;
  })));

  it('should create the create task page', async(() => {
    expect(instance).toBeTruthy();
  }));

  it('should not has the task information if form-action is create', async(() => {
    let template = fixture.nativeElement;
    fixture.detectChanges();

    let title = template.getElementsByTagName('ion-input')[0];
    let titleValue = title.getAttribute('ng-reflect-model');
    expect(titleValue).toBe('');
  }));
});
