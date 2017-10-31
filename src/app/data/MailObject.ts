import {CourseSelectComponent} from "../CourseSelectComponent";
import {CourseBookComponent} from "../CourseBookComponent";

export class MailObject {
  from:string;
  subject:string;
  content:string;
  to:string[]=new Array();
  cc:string[]=new Array();
  bcc:string[]=new Array();
  recipientString: string="";
  ccString: string="";
  bccString: string="";

  constructor(from:string,to:string,subject:string,body:string) {
    this.from=from;
    this.to.push(to);
    this.recipientString=to;
    this.subject=subject;
    this.content=body;
  }

  addCC(s:string) {
    this.cc.push(s);
    this.ccString=this.cc.join(",");
  }

  addBCC(s:string) {
    this.bcc.push(s);
    this.bccString=this.bcc.join(",");
  }

  getBody():string {
    let b:string="";
    b+="fromMail="+this.from+"&subjectMail="+this.subject+"&emailBody="+this.content+"&auth_token="+CourseBookComponent.courseBook.auth_token;
    if (this.recipientString.length!=0) {
      let recipientBodyString = this.recipientString.replace(" ","");
      var find = ',';
      var re = new RegExp(find, 'g');
      recipientBodyString = recipientBodyString.replace(re,";");
      b+="&toMail="+recipientBodyString;
    }
    if (this.ccString.length!=0) {
      let ccBodyString = this.ccString.replace(" ","");
      var find = ',';
      var re = new RegExp(find, 'g');
      ccBodyString = ccBodyString.replace(re,";");
      b+="&cc="+ccBodyString;
    }
    if (this.bccString.length!=0) {
      let bccBodyString = this.bccString.replace(" ","");
      var find = ',';
      var re = new RegExp(find, 'g');
      bccBodyString = bccBodyString.replace(re,";");
      b+="&bcc="+bccBodyString;
    }
    return b;
  }
}

