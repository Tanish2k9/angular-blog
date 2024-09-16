import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  router:Router = inject(Router)

  navigateToPage():void{
    console.log("chala")
    this.router.navigate(["/blog"])
  }
}
