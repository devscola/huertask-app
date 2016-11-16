import { ComponentFixture, async } from '@angular/core/testing';
import { TestUtils }               from '../../test';
import { CreateTask }             from './create-task';


let fixture: ComponentFixture<Tasks> = null;
let instance: any = null;

describe('Pages: Create Task', () => {

  beforeEach(async(() => TestUtils.beforeEachCompiler([CreateTask]).then(compiled => {
    fixture = compiled.fixture;
    instance = compiled.instance;
  })));

  it('should create the create task page', async(() => {
    expect(instance).toBeTruthy();
  }));
});
