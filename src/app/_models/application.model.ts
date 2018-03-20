export class Application {
  id: string;
  email: string;
  name: string;
  graduation_year: string;
  essay: string;
  school: string;
  in_app: boolean;
  
  constructor(data = null) {
    if (data) {
      this.setData(data);
    }
  }

  setData(data) {
    this.id = data.id || this.id;
    this.email = data.email || this.email;
    this.name = data.name || this.name;
    this.school = data.school || this.school; 
    this.graduation_year = data.graduation_year || this.graduation_year;
    this.essay = data.essay || this.essay;    
    this.in_app = data.in_app || this.in_app;    
  }
}