import {Component, OnInit} from '@angular/core';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-time-series',
  templateUrl: './time-series.component.html',
  styleUrls: ['./time-series.component.css']
})
export class TimeSeriesComponent implements OnInit {
  title = 'Time Series example';
  model: tf.Sequential;
  prediction: any = "Calculating...";
  predictForward: any;
  prices: any = [14.05, 11.03, 15.5, 17.8, 11.19, 15.85, 16.06, 15.07, 13.84, 16.85,
    14.49, 13.87, 12.86, 13.16, 12.71, 15.86, 12.7, 17.8, 15.83, 17.11, 14.75, 15.18, 12.88,
    16.75, 16.09, 14.29, 16.21, 14.58, 12.36, 13.95, 12.36, 17.95, 17.46, 11.69, 12.81, 17.85,
    11.69, 15.55, 16.6, 16.25, 17.96, 15.39, 11.84, 16.15, 15.88, 11.72, 17.82, 14.97, 14.71,
    14.64, 15.14, 12.29, 16.72, 15.48, 16.07, 12.93, 14.57, 12.94, 12.96, 17.44, 16.9, 14.97,
    14.53, 17.28, 16.11, 16.15, 15.08, 13.42, 16.19, 13.21, 15.04, 13.02, 16.04, 11.67, 14.32,
    11.1, 13.76, 13.07, 11.37, 14.47, 12.49, 14.49, 15.96, 17.66, 12.34, 17.77, 13.11, 16.49,
    12.67, 14.56, 17.99, 16.53, 15.39, 16, 13.13, 13.61, 15.53, 11.56, 12.13, 16.9, 13.49, 13.21,
    16.88, 13.85, 14.53, 16.61, 13.68, 17.29, 12.51, 11.62, 13.14, 16.9, 15.99, 12.35, 14.51,
    16.59, 12.65, 14.26, 12.65, 16.8, 13.4, 11.64, 14.95, 14.79, 11.22, 14.1, 15.07, 16.31,
    15.32, 17.92, 13.4, 12.64, 11.28, 15.92, 11.76, 12.52, 17.82, 17.19, 11.01, 16.79, 16.9,
    17.38, 16.44, 13.13, 15.42, 15.4, 16.62, 11.83, 11.48, 12.04, 13.54, 13.54, 13.54, 13.54,
    13.54, 13.54, 13.54, 13.54, 13.54, 13.54, 13.54, 13.54, 17.42, 17.42, 17.42, 17.42, 17.42,
    17.42, 17.42, 17.42, 17.42, 17.42, 17.42, 17.42, 17.42, 17.42, 17.42, 17.42, 17.42, 17.42,
    17.42, 17.42, 17.42, 17.42, 17.42, 17.42, 17.42, 17.42, 17.42, 17.42, 17.42, 17.42, 17.42,
    17.42, 17.42];

  constructor() {
  }

  ngOnInit() {
    this.trainNewModel().then(() => {
      console.log(this.prediction);
    });
  }

  async trainNewModel() {

    // shape the data for lstm
    const sampleSize = 1;
    let samplesX = [];
    let samplesY = [];
    let start = 0; // must be multiple of sample size
    this.predictForward = 28; // must be multiple of sampleSize
    let j = start + this.predictForward;
    for (let i = start; i < this.prices.length - this.predictForward; i += sampleSize) {
      let chunk = this.prices.slice(i, i + sampleSize);
      samplesX.push(chunk);

      chunk = this.prices.slice(j, j + sampleSize);
      samplesY.push(chunk);
      j += sampleSize;
    }

    // setup the model
    this.model = tf.sequential();
    const learningRate = 0.05;
    const optimizerVar = tf.train.adam(learningRate);
    let tensorSamplesX = tf.tensor(samplesX, [samplesX.length, sampleSize, 1]);
    let tensorSamplesY = tf.tensor(samplesY, [samplesY.length, sampleSize, 1]);

    // layer 1
    this.model.add(tf.layers.lstm({
      units: 50,
      returnSequences: true,
      inputShape: [tensorSamplesX.shape[1], 1],
      dropout: 0.2
    }));

    // layer 2
    this.model.add(tf.layers.lstm({
      units: 50,
      returnSequences: true,
      dropout: 0.2
    }));

    // layer 3
    this.model.add(tf.layers.lstm({
      units: 50,
      returnSequences: true,
      dropout: 0.2
    }));

    // output layer
    this.model.add(tf.layers.dense({units: 1}));

    // compile and fit
    this.model.compile({loss: 'meanSquaredError', optimizer: optimizerVar});
    //let shape = [samplesX.length, sampleSize, 1];
    await this.model.fit(tensorSamplesX, tensorSamplesY, {epochs: 30, batchSize: 10});
    console.log("Model trained!");

    // predict
    const output = this.model.predict(tensorSamplesX) as any;
    this.prediction = Array.from(output.dataSync())[0];

    //stop memory leaks
    this.model.dispose();
    tf.disposeVariables();
  }

}
