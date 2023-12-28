import { Injectable } from '@angular/core';

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

@Injectable({
  providedIn: 'root',
})
export class FileSystemAccessApiService {
  async getOpenedFile() {
    if ('showOpenFilePicker' in window) {
      let fileHandle;

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
      try {
        const newHandle = await window.showSaveFilePicker(options);

        const writableStream = await newHandle.createWritable();

        const dateTime = new Date().toISOString();
        await writableStream.write(dateTime);

        await writableStream.close();
      } catch (error) {
        console.log('Open operation was canceled.');
      }
    } else {
      console.error('Your browser doesn\'t support "File system access API"');
    }
  }
}
