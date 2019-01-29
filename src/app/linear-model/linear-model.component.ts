import {Component, OnInit} from '@angular/core';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-linear-model',
  templateUrl: './linear-model.component.html',
  styleUrls: ['./linear-model.component.css']
})
export class LinearModelComponent implements OnInit {
  title = 'Linear Model example';
  linearModel: tf.Sequential;
  prediction: any;

  xData: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  yData: number[] = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  constructor() {
  }

  ngOnInit() {
    this.trainNewModel();
  }

  async trainNewModel() {
    // this is based on the following tutorial:
    // https://angularfirebase.com/lessons/tensorflow-js-quick-start/#Step-2-Install-Tensorflow-js
    const learningRate = 0.01;
    const optimizerVar = tf.train.sgd(learningRate);

    // Define a model for linear regression.
    this.linearModel = tf.sequential();
    this.linearModel.add(tf.layers.dense({units: 1, inputShape: [1], activation: 'relu', kernelInitializer: 'ones'}));

    // Prepare the model for training: Specify the loss and the optimizer.
    this.linearModel.compile({loss: 'meanSquaredError', optimizer: optimizerVar});

    // Training data defined at top
    const x = tf.tensor1d(this.xData);
    const y = tf.tensor1d(this.yData);

    // Train
    await this.linearModel.fit(x, y, {epochs: 10});
    console.log('model trained!');

  }

  predict(val) {
    val = parseFloat(val);
    const output = this.linearModel.predict(tf.tensor2d([val], [1, 1])) as any;
    this.prediction = Array.from(output.dataSync())[0];
    console.log(output.toString());
  }

}
