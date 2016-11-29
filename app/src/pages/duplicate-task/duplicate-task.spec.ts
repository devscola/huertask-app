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
});
