export class MailObject {
  from:string;
  subject:string;
  content:string;
  to:string[]=new Array();
  cc:string[]=new Array();
  bcc:string[]=new Array();

  constructor(from:string,to:string,subject:string,body:string) {
    this.from=from;
    this.to.push(to);
    this.subject=subject;
    this.content=body;
  }

  addCC(s:string) {
    this.cc.push(s);
  }

  addBCC(s:string) {
    this.bcc.push(s);
  }

  getBody():string {
    let b:string="";
    b+="toMail="+this.to+"&fromMail="+this.from+"&subjectMail="+this.subject+"&emailBody="+this.content;
    if (this.cc.length!=0) {
      let ccString = this.cc.join();
      ccString = ccString.replace(",",";");
      b+="&cc="+ccString;
    }
    if (this.bcc.length!=0) {
      let bccString = this.bcc.join();
      bccString = bccString.replace(",",";");
      b+="&bcc="+bccString;
    }
    return b;
  }
}

