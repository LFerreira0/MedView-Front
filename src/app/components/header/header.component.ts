import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(public router: Router){}

  public loginRedirect(){
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/login`])
    );
    window.open(url, '_blank');
  }
}
