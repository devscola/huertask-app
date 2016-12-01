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
});
