import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'demo';
  items: MenuItem[] = [];
  activeItem: MenuItem | undefined;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.items = [
      { label: '首頁', icon: 'pi pi-fw pi-home' },
      { label: '留言板', icon: 'pi pi-fw pi-calendar' },
    ];
  }

  onActiveItemChange(eve: MenuItem){
    this.activeItem = eve;
    console.log(this.activeItem);
    if(this.activeItem.label === '首頁'){
      this.router.navigate(['']);
    }else if(this.activeItem.label === '留言板'){
      this.router.navigate(['board']);
    }
  }
}

