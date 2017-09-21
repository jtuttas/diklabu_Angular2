export class Course {
  public KNAME: string="NoCourse";
  public id: number=-1;
  public ID_LEHRER:string="NN"
  public  idKategorie=-1;

  constructor(id:number,name:string) {
    this.id=id;
    this.KNAME=name;
    this.toString();
  }

  toString() {
    console.log(" > Coursename:"+this.KNAME+" ID="+this.id);
  }
}
