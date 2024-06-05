import { Component, OnInit } from '@angular/core';
import { ArduinoService } from './service/arduino.service'
import { Chart } from 'chart.js/auto';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  arduinoData: any;
  chart!: Chart;
  labels: any[] = [];
  dataset: any[] = [];

  constructor(private arduinoService: ArduinoService) {}

  ngOnInit() {
    console.log("Cargando pagina...");
    this.getArduinoData();
    this.extractNumber("54.03*Hz")

  }

  getArduinoData() {
    this.arduinoService.getDataFromArduino().subscribe(
      data => {
        this.arduinoData = data;
        console.log("length: ", this.arduinoData?.length )
        console.log("DATA: ", this.arduinoData)
        this.getDatosChart();
      },
      error => console.error('Error al obtener datos desde Arduino:', error)
    )
  }

  getDatosChart(){
    console.log("this.arduinoData.data.length: ", this.arduinoData?.data?.length)
    for (let i = 0; i < this.arduinoData?.data?.length; i++) {
      this.labels.push(this.arduinoData?.data[i].fecha);
      let frec = this.extractNumber(this.arduinoData?.data[i].frecuencia)
      this.dataset.push(frec);
    }

    console.log("labels: ", this.labels)
    console.log("dataset: ", this.dataset)

    const data = {
      labels: this.labels,
      datasets: [{
        label: 'Frecuencia',
        data: this.dataset,
        fill: false,
        borderColor: '#000',
        tension: 0.1
      }]
    };

    this.chart = new Chart("chart", {type: 'line',data});
  }

   extractNumber(value: string): number {
    const result = value.match(/[0-9.]+/);
    console.log("result: ", result ? parseFloat(result[0]): "--")
    return result ? parseFloat(result[0]) : NaN;
   }
}
