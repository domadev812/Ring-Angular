import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class NavbarService {

  public visible: boolean;
  
  public activeTab: string;

  tabEvent: EventEmitter<any> = new EventEmitter<any>();
  constructor() { 
    this.visible = false; 
  }

  hide() { this.visible = false; }

  show() { this.visible = true; }

  toggle() { this.visible = !this.visible; }

  activeTabChanged(tab: string): void {
    this.activeTab = tab;    
    this.tabEvent.emit(this.activeTab);
  }
}