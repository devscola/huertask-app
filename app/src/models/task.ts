export class Task {
  constructor(
    public title: string = '',
    public people: number = 0,
    public category: string ='',
    public from_date?: any,
    public to_date?: any,
    public created_at?: any,
    public note?: string,
    public participants?: any[]
  ) {  }
}
