export class Task {
  constructor(
    public title: string = '',
    public people: number = 0,
    public category: string ='',
    public date: any = new Date()
  ) {  }
}
