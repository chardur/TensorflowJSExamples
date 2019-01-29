import {Component, Input, OnInit} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @Input() model: any;
  @Input() data: any;
  visorInstance = tfvis.visor();

  constructor() { }

  ngOnInit() {
    this.setupVisor();
    this.setupListeners();

  }

  setupVisor(){
    let dataSurface = this.visorInstance.surface({name: 'The Data', tab: 'View Data'});
    let modelSurface = this.visorInstance.surface({name: 'The Model', tab: 'View Model'});

    this.showData(dataSurface);
  }

  async watchTraining() {
    const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
    const container = {
      name: 'show.fitCallbacks', tab: 'Training', styles: { height: '1000px' }
    };
    const callbacks = tfvis.show.fitCallbacks(container, metrics);
    return this.train(this.model, this.data, callbacks);
  }

  async train(model, data, fitCallbacks) {
    const BATCH_SIZE = 64;
    const trainDataSize = 500;
    const testDataSize = 100;

    const [trainXs, trainYs] = tf.tidy(() => {
      const d = data.nextTrainBatch(trainDataSize);
      return [
        d.xs.reshape([trainDataSize, 28, 28, 1]),
        d.labels
      ]
    });

    const [testXs, testYs] = tf.tidy(() => {
      const d = data.nextTestBatch(testDataSize);
      return [
        d.xs.reshape([testDataSize, 28, 28, 1]),
        d.labels
      ]
    });

    return model.fit(trainXs, trainYs, {
      batchSize: BATCH_SIZE,
      validationData: [testXs, testYs],
      epochs: 10,
      shuffle: true,
      callbacks: fitCallbacks
    });
  }

  showData(surface){
    const drawArea = surface.drawArea;
    const dataCanvas = document.createElement('dataCanvas');
    for (let i = 0; i < this.data.length; i++) {
      let item = document.createTextNode(this.data[i] + ", ");
      dataCanvas.appendChild(item);
    }
    drawArea.appendChild(dataCanvas);
  }

  setupListeners() {

    document.querySelector('#show-visor').addEventListener('click', () => {

      if (!this.visorInstance.isOpen()) {
        this.visorInstance.toggle();
      }
    });

    document.querySelector('#load-data').addEventListener('click', async (e) => {
      //await initData();
      (document.querySelector('#show-examples') as HTMLButtonElement).disabled = false;
      (document.querySelector('#start-training-1') as HTMLButtonElement).disabled = false;
      (document.querySelector('#start-training-2') as HTMLButtonElement).disabled = false;
      (e.target as HTMLButtonElement).disabled = true;
    });
  }
}
