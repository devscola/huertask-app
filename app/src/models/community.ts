export class Community {
  constructor(
    public id?: number,
    public name: string = '',
    public description?: string,
    public joined: any[] = [],
    public invited: any[] = [],
  ) {  }
}
