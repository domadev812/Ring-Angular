export class Notification {
  id: string;
  subject: string;
  message: string;
  careers: string;
  sent_date: string;
  career_titles: Array<string>;


  constructor(data) {
    this.setData(data);
  }

  setData(data) {
    this.id = data.id || this.id;
    this.subject = data.subject || this.subject;
    this.message = data.message || this.message;
    this.careers = data.careers || this.careers;
    this.sent_date = data.sent_date || this.sent_date;
  }
}