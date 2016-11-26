import { ComponentFixture, async } from '@angular/core/testing';
import { TestUtils }               from '../../test';
import { DuplicateTask }             from './duplicate-task';


let fixture: ComponentFixture<DuplicateTask> = null;
let instance: any = null;

describe('Pages: Duplicate Task', () => {

  beforeEach(async(() => TestUtils.beforeEachCompiler([DuplicateTask]).then(compiled => {
    fixture = compiled.fixture;
    instance = compiled.instance;
  })));

  it('should create the duplicate task page', async(() => {
    expect(instance).toBeTruthy();
  }));

  fit('should not has the task information if form-action is duplicate', async(() => {
    let template = fixture.nativeElement;
    fixture.detectChanges();

    let title = template.getElementsByTagName('ion-input')[0];
    let titleValue = title.getAttribute('ng-reflect-model');
    expect(titleValue).toBe('Tarea numero 3');

    let fromDate = template.getElementsByTagName('ion-datetime')[0];
    let fromDateValue = fromDate.getAttribute('ng-reflect-model');
    expect(fromDateValue).toBe('');
  }));
});
