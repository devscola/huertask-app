export class Person {
  constructor(
    public id?: number,
    public name: string = '',
    public categories?: any[],
  ) {  }

  hasCategory = (category) => {
    this.categories.find(cat => cat.id !== category.id)
  }
}
