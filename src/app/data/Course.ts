export class Course {
  public KNAME: String="NoCourse";
  public id: number=-1;
  public ID_LEHRER:String="NN"
  public  idKategorie=-1;

  constructor(id:number,name:String) {
    this.id=id;
    this.KNAME=name;
    this.toString();
  }

  toString() {
    console.log(" > Coursename:"+this.KNAME+" ID="+this.id);
  }
}
