export class Plot {
  constructor(
    public id?: number,
    public name: string = '',
    public number: number = null,
    public person: any = null,
  ) {  }

  getFullName = () => {
    return this.name + ' ' + (this.number || '')
  };
}
