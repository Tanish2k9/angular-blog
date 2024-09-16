import { Component } from '@angular/core';
import { CardComponent } from "../../shared/card/card.component";

@Component({
  selector: 'app-most-viewed',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './most-viewed.component.html',
  styleUrl: './most-viewed.component.css'
})
export class MostViewedComponent {

}
