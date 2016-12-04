export class Task {
  constructor(
    public id?: number,
    public status?: number,
    public title: string = '',
    public required_people: number = 0,
    public categories?: any[],
    public from_date?: any,
    public to_date?: any,
    public created_at?: any,
    public note?: string,
    public people_going?: any[],
    public people_not_going?: any[],
  ) {  }
}
