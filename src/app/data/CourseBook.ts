import {Course} from "./Course";
import {Verlauf} from "./Verlauf";

export class  CourseBook {
  public fromDate:Date;
  public toDate:Date;
  public course:Course;
  public idLehrer:string;
  public auth_token;
  public role: string;
  public ID: string;
  public username:string;
  public password:string;
  public email:string;
  public idSchuljahr: number;


  constructor(from:Date,to:Date,course:Course) {
    console.log("Constructed new Coursebook!");
    this.fromDate=from;
    this.toDate=to;
    this.course=course;
  }

  public toString() {
    console.log("from="+this.fromDate+ " to="+this.toDate+" Course:"+this.course.KNAME+"  ID="+this.course.id);
  }

  public static toSQLString(d:Date) {
    let m="00";
    let t="00";
    if ((d.getMonth()+1)<10) {
      m="0"+(d.getMonth()+1);
    }
    else {
      m=""+(d.getMonth()+1);
    }
    if (d.getDate()<10) {
      t="0"+d.getDate();
    }
    else {
      t=""+d.getDate();
    }
    return d.getFullYear()+"-"+m+"-"+t;
  }

  public static toIDString(d:Date) {
    let m="00";
    let t="00";
    if ((d.getMonth()+1)<10) {
      m="0"+(d.getMonth()+1);
    }
    else {
      m=""+(d.getMonth()+1);
    }
    if (d.getDate()<10) {
      t="0"+d.getDate();
    }
    else {
      t=""+d.getDate();
    }
    return d.getFullYear()+m+t;
  }

  static wochentage=["So.","Mo.","Di.","Mi.","Do.","Fr.","Sa."];
  public static toReadbleString(d:Date):string {
    return  CourseBook.wochentage[d.getDay()]+" "+d.getDate()+"."+(d.getMonth()+1)+"."+d.getFullYear();
  }
}
