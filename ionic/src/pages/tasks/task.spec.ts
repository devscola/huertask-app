import { ComponentFixture, async } from '@angular/core/testing';
import { TestUtils }               from '../../test';
import { Tasks }          from './tasks';

let fixture: ComponentFixture<Tasks> = null;
let instance: any = null;

describe('Pages: Tasks', () => {

  beforeEach(async(() => TestUtils.beforeEachCompiler([Tasks]).then(compiled => {
    fixture = compiled.fixture;
    instance = compiled.instance;
  })));

  it('should create the hello ionic page', async(() => {
    expect(instance).toBeTruthy();
  }));
});
