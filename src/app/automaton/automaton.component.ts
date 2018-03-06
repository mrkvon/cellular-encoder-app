import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-automaton',
  templateUrl: './automaton.component.html',
  styleUrls: ['./automaton.component.css']
})
export class AutomatonComponent implements OnChanges, OnInit {

  @ViewChild('rules') canvasRulesRef: ElementRef;
  @ViewChild('automaton') canvasAutomatonRef: ElementRef;
  @ViewChild('automatonOverlay') canvasOverlayRef: ElementRef;

  constructor() { }

  public rule = 30;
  public rows = 30;
  private ctx: CanvasRenderingContext2D;
  private automatonCtx: CanvasRenderingContext2D;
  private overlayCtx: CanvasRenderingContext2D;
  @Input() ascii: number;
  private cellSize: number;
  private automatonOffset: number;
  public encodedAscii: [number, number];

  ngOnInit() {
    this.ctx = this.canvasRulesRef.nativeElement.getContext('2d');
    this.automatonCtx = this.canvasAutomatonRef.nativeElement.getContext('2d');
    this.overlayCtx = this.canvasOverlayRef.nativeElement.getContext('2d');
    this.updateView();
    this.highlight(this.encodedAscii)
  }

  ngOnChanges(changes: SimpleChanges) {
    const asciiChange = changes['ascii'];
    if (asciiChange.previousValue === asciiChange.currentValue) return;

    this.encodedAscii = this.encodeAscii(this.ascii);
    this.highlight(this.encodedAscii);
  }

  onKey(value: number) {
    this.rule = value;
    this.updateView();
  }

  onKeyRows(value: number) {
    this.rows = value;
    this.updateView();
  }

  private updateView() {
    this.renderRules();
    this.renderAutomaton(this.rows);
    this.encodedAscii = this.encodeAscii(this.ascii);
    this.highlight(this.encodedAscii);
  }

  private drawRule(ctx, no: number, rule: number, offsetRect=0, size=20): void {

    const out = (rule >> no) % 2

    const offset = offsetRect * size;
    // draw the rectangles
    ctx.fillStyle = (no & 4) ? 'black' : 'white';
    ctx.fillRect(offset, 0, size, size)
    ctx.fillStyle = (no & 2) ? 'black' : 'white';
    ctx.fillRect(size + offset, 0, size, size)
    ctx.fillStyle = (no & 1) ? 'black' : 'white';
    ctx.fillRect(2 * size + offset, 0, size, size)
    ctx.fillStyle = (out) ? 'black' : 'white';
    ctx.fillRect(size + offset, size, size, size)

    // draw the outline
    ctx.strokeStyle = 'grey';
    ctx.lineWidth = 2;
    ctx.strokeRect(offset, 0, 3 * size, size);
    ctx.strokeRect(size + offset, 0, size, 2 * size);
  }

  private renderRules() {
    for (let i = 0; i < 8; ++i) {
      this.drawRule(this.ctx, i, this.rule, (7 - i) * 4)
    }
  }

  private renderAutomatonRow(row: boolean[], round: number, width=15, offset=0) {

    row.forEach((cell, i) => {
      this.automatonCtx.fillStyle = (cell) ? 'black' : 'white';
      this.automatonCtx.fillRect(width * (row.length - 1 - i) + offset, round * width, width, width)
    });

  }

  private renderAutomaton(rows) {
    // clear the canvas first
    this.automatonCtx.clearRect(0, 0, 600, 320)
    // print automaton with rule and amount of rows
    // the first row has 1 in the middle
    let currentRow: boolean[] = Array(2 * rows - 1).fill(false);
    currentRow[rows - 1] = true;

    const width = Math.min(Math.floor(600 / (2 * rows - 1)), 20);
    const offset = Math.floor((600 - (2 * rows - 1) * width) / 2);
    this.cellSize = width;
    this.automatonOffset = offset;

    // amount of cells in each row
    // we make them intentionally wider so the outcome is not influenced by edges

    for (let i = 0; i < rows; ++i) {
      this.renderAutomatonRow(currentRow, i, width, offset);
      currentRow = this.nextRow(currentRow)
    }
  }

  private highlight([row, column]: [number, number]) {
    if (!this.overlayCtx) return;
    // clear the automaton
    this.overlayCtx.clearRect(0, 0, 600, 320);
    // do nothing if character was not found
    if (row < 0) return;
    const columns = 2 * this.rows - 1;

    this.overlayCtx.strokeStyle = '#ff4081';
    this.overlayCtx.lineWidth = 2;

    const columnPosition = this.automatonOffset + this.cellSize * (this.rows - 4 + column);
    const rowPosition = row * this.cellSize;

    this.overlayCtx.strokeRect(columnPosition, rowPosition, 7 * this.cellSize, this.cellSize);
  }

  /**
   * given a rule and three original cells, count the outcome of the automaton
   */
  private nextCell(three: number) {
    return (this.rule >> three) % 2;
  }

  /* given a row lenght, representation of its state as integer and rule */
  private nextRow(row: boolean[]): boolean[] {
    const length = row.length
    const nextRow = Array(length).fill(false);
    row.push(row[length - 1])
    row.unshift(row[0]);

    for (let i = 0; i < length; ++i) {
      nextRow[i] = this.nextCell(4 * Number(row[2]) + 2 * Number(row[1]) + 1 * Number(row[0]));
      row.shift();
    }

    return nextRow;
  }

  private encodeAscii(code: number): [number, number] {
    // the first row has 1 in the middle
    let currentRow: boolean[] = Array(2 * this.rows - 1).fill(false);
    currentRow[this.rows - 1] = true;

    // amount of cells in each row
    // we make them intentionally wider so the outcome is not influenced by edges

    for (let i = 0; i < this.rows; ++i) {
      // try to find the desired sequence of bits in the current automaton row
      const out = this.search(currentRow, code);
      if (out > -1) {
        return [i, this.rows - out - 4];
      }
      currentRow = this.nextRow(currentRow);
    }

    return [-1, -1]
  }

  private search(row: boolean[], code: number): number {
    return row.findIndex((element, index, array) => {
      if (array.length - index < 7) return false;
      let currentCode = 0;
      for (let i = 0; i < 7; ++i) {
        currentCode |= +array[index + i] << i;
      }

      return currentCode === code;
    });
  }
}
