export class Task {
  constructor(
    public id?: number,
    public status?: number,
    public title: string = '',
    public required_people: number = 0,
    public category: string ='',
    public from_date?: any,
    public to_date?: any,
    public created_at?: any,
    public note?: string,
    public people_going?: any[],
    public people_not_going?: any[],
  ) {  }

  peopleLeft = () => {
    let people_left = this.required_people - this.people_going.length;
    if (people_left < 0){ people_left = 0; }
    return people_left
  }

  peopleMessage = () => {
    switch (this.peopleLeft()) {
       case 0:
         return "TASK.PEOPLE_LEFT.MSG.ZERO";
       case 1:
         return "TASK.PEOPLE_LEFT.MSG.ONE";
       default:
         return "TASK.PEOPLE_LEFT.MSG.PLURAL";
    }
  }

  clean = () => {
    delete this['id']
    delete this['people_going']
    delete this['people_not_going']
    return this
  }

  isFinalized = () => {
    return this['status'] == 1
  }

  finalizeColor = () => {
    return this.isFinalized() ? 'success' : 'dark'
  }

  toggleFinalized = () => {
    this['status'] = this.isFinalized() ? 0 : 1;
    return this
  }

  isUserGoing = (): boolean => {
    return !!this.people_going.find(person => person.id == 1)
  }

  isUserNotGoing = (): boolean => {
    return !!this.people_not_going.find(person => person.id == 1)
  }

  isCovered = (): boolean => {
    return (this.required_people - this.people_going.length) == 0
  }

  userNotAllowedToGo = ():boolean => {
    return this.isCovered() && !this.isUserGoing()
  }
}
