export class Termin {
  NAME: string;
  id: number;

  constructor(name:string,id:number) {
    this.NAME=name;
    this.id=id;
  }
}

export class Termindaten {
  date: string;
  milliseconds: number;
}
