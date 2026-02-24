import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CredentialTrackerComponent } from './component/credential-tracker/credential-tracker'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CredentialTrackerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('healthcare-frontend');
}
