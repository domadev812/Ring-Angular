export class Application {
  id: string;
  email: string;
  name: string;
  graduation_year: string;
  essay: string;

  constructor(data) {
    this.setData(data);
  }

  setData(data) {
    this.id = data.id || this.id;
    this.email = data.email || this.email;
    this.name = data.name || this.name;
    this.graduation_year = data.graduation_year || this.graduation_year;
    this.essay = data.essay || this.essay;    
  }
}