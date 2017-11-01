import {CourseSelectComponent} from "../CourseSelectComponent";
import {CourseBookComponent} from "../CourseBookComponent";
import { URLSearchParams } from '@angular/http';

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

  getBody():URLSearchParams {
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('fromMail', this.from);
    urlSearchParams.append('subjectMail', this.subject);
    urlSearchParams.append('emailBody', this.content);
    urlSearchParams.append('auth_token', CourseBookComponent.courseBook.auth_token);
    if (this.recipientString.length!=0) {
      let recipientBodyString = this.recipientString.replace(" ","");
      var find = ',';
      var re = new RegExp(find, 'g');
      recipientBodyString = recipientBodyString.replace(re,";");
      urlSearchParams.append('toMail', recipientBodyString);
    }
    if (this.ccString.length!=0) {
      let ccBodyString = this.ccString.replace(" ","");
      var find = ',';
      var re = new RegExp(find, 'g');
      ccBodyString = ccBodyString.replace(re,";");
      urlSearchParams.append('cc', ccBodyString);
    }
    if (this.bccString.length!=0) {
      let bccBodyString = this.bccString.replace(" ","");
      var find = ',';
      var re = new RegExp(find, 'g');
      bccBodyString = bccBodyString.replace(re,";");
      urlSearchParams.append('bcc', bccBodyString);
    }
    return urlSearchParams;
  }
}

