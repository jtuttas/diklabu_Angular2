import {Course} from "./Course";

export class  CourseBook {
  public fromDate:Date;
  public toDate:Date;
  public course:Course;

  constructor(from:Date,to:Date,course:Course) {
    this.fromDate=from;
    this.toDate=to;
    this.course=course;
  }

  public toString() {
    console.log("from="+this.fromDate+ " to="+this.toDate+" Course:"+this.course.coursename+" ID="+this.course.id);
  }
}
