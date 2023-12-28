import { Component, inject } from '@angular/core';
import { FileSystemAccessApiService } from './services/file-system-access-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private fs = inject(FileSystemAccessApiService);

  getOpenedFile(): void {
    this.fs.getOpenedFile();
  }

  saveDataToFile(): void {
    this.fs.saveDataToFile();
  }
}
