export class Course {
  public coursename: String="NoCourse";
  public id: number=-1;

  constructor(id:number,name:String) {
    this.id=id;
    this.coursename=name;
    this.toString();
  }

  toString() {
    console.log("Course:"+this.coursename+" ID="+this.id);
  }
}
