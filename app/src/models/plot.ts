export class Plot {
  constructor(
    public id?: number,
    public name: string = '',
    public number: number = null,
    public person: any = null,
    public status: number = null,
  ) {  }

  getFullName = () => {
    return this.name + ' ' + (this.number || '');
  }

  searcheable = () => {
    return this.getFullName();
  }
}
