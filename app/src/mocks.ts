// IONIC:

export class ConfigMock {

  public get(): any {
    return '';
  }

  public getBoolean(): boolean {
    return true;
  }

  public getNumber(): number {
    return 1;
  }
}

export class FormMock {
  public register(): any {
    return true;
  }
}

export class NavMock {

  public pop(): any {
    return new Promise(function(resolve: Function): void {
      resolve();
    });
  }

  public push(): any {
    return new Promise(function(resolve: Function): void {
      resolve();
    });
  }

  public getActive(): any {
    return {
      'instance': {
        'model': 'something',
      },
    };
  }

  public setRoot(): any {
    return true;
  }

  public get(obj): any {
    return {
      "id":141,
      "created_at":"2016-11-21T09:02:40+01:00",
      "title":"Tarea numero 3",
      "from_date":"2020-11-12T13:00:00+01:00",
      "to_date":"2020-11-12T13:00:00+01:00",
      "required_people":3,
      "category":"3",
      "note":null,
      "people_going":[
        {
          "id":3,
          "name":"Persona 3"
        }
      ],
      "people_not_going":[]
    };
  }
}

export class PlatformMock {
  public ready(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
}

export class MenuMock {
  public close(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
}
