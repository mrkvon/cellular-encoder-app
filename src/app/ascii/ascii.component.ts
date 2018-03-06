import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-ascii',
  templateUrl: './ascii.component.html',
  styleUrls: ['./ascii.component.css']
})
export class AsciiComponent implements OnInit {

  @ViewChild('ascii') canvasAsciiRef: ElementRef;

  @Output() change = new EventEmitter<number>();

  constructor() { }

  public decimal = 97;
  public ctx: CanvasRenderingContext2D;

  ngOnInit() {
    this.ctx = this.canvasAsciiRef.nativeElement.getContext('2d');
    this.drawBinary();
  }

  onKey(value: number) {
    this.decimal = value;
    this.change.emit(value);
    this.drawBinary();
  }

  get character() {
    return String.fromCharCode(this.decimal);
  }

  get hex() {
    return this.decimal.toString(16)
  }

  get binary() {
    return this.decimal.toString(2)
  }

  private drawBinary(): void {
    let code = this.decimal;
    const size = 30;

    for (let i = 0; i < 7; ++i) {
      this.ctx.fillStyle = (code % 2) ? 'black' : 'white';
      this.ctx.fillRect((6 - i) * size, 0, size, size);

      code = code >> 1;
      // draw the outline
      this.ctx.strokeStyle = 'grey';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(1 * size, 0, size, size);
      this.ctx.strokeRect(3 * size, 0, size, size);
      this.ctx.strokeRect(5 * size, 0, size, size);
      this.ctx.strokeRect(0, 0, 7 * size, size);
    }
  }
}
