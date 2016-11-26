import { ComponentFixture, async } from '@angular/core/testing';
import { TestUtils }               from '../../test';
import { EditTask }             from './edit-task';


let fixture: ComponentFixture<EditTask> = null;
let instance: any = null;

describe('Pages: Edit Task', () => {

  beforeEach(async(() => TestUtils.beforeEachCompiler([EditTask]).then(compiled => {
    fixture = compiled.fixture;
    instance = compiled.instance;
  })));

  it('should create the edit task page', async(() => {
    expect(instance).toBeTruthy();
  }));

  it('should has the task information if form-action is edit', async(() => {
    let template = fixture.nativeElement;
    fixture.detectChanges();

    let title = template.getElementsByTagName('ion-input')[0];
    let titleValue = title.getAttribute('ng-reflect-model');
    expect(titleValue).toBe('Tarea numero 3');
  }));
});
