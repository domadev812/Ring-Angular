export class MessageBoard {
  id: number;
  message: string;
  link: string;

  constructor(data) {
    if (data) {
      this.id = data.id;
      this.message = data.message;
      this.link = data.link;
    }
  }
}