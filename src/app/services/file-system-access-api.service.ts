import { Injectable, inject } from '@angular/core';
import { SensorDataService } from './sensors-data.service';

@Injectable({
  providedIn: 'root',
})
export class FileSystemAccessApiService {
  private readonly sensors = inject(SensorDataService);

  async getOpenedFile() {
    if ('showOpenFilePicker' in window) {
      let fileHandle;

      const options: OpenFilePickerOptions = {
        types: [
          {
            description: 'Text',
            accept: {
              'text/plain': ['.txt'],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      };

      try {
        [fileHandle] = await window.showOpenFilePicker(options);
        const fileData = await fileHandle.getFile();

        const fr = new FileReader();

        fr.readAsText(fileData);

        fr.addEventListener('loadend', () => {
          console.log('FILE CONTENT: \n', fr.result);
        });
      } catch (error) {
        console.log('Open operation was canceled.');
      }
    } else {
      console.error('Your browser doesn\'t support "File system access API"');
    }
  }

  async saveDataToFile() {
    if ('showSaveFilePicker' in window) {
      const options: SaveFilePickerOptions = {
        types: [
          {
            description: 'Text',
            accept: {
              'text/plain': ['.txt'],
            },
          },
        ],
        suggestedName: `data_sample_${new Date().toISOString().split('.')[0]}`,
        excludeAcceptAllOption: true,
      };

      try {
        const newHandle = await window.showSaveFilePicker(options);

        const writableStream = await newHandle.createWritable();

        const dataToSave = {
          date: new Date().toISOString(),
          sensorsData: this.sensors.getData(),
        };
        await writableStream.write(JSON.stringify(dataToSave));

        await writableStream.close();
      } catch (error) {
        console.log('Open operation was canceled.');
      }
    } else {
      console.error('Your browser doesn\'t support "File system access API"');
    }
  }
}
