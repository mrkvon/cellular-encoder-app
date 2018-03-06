import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('rules') canvasRulesRef: ElementRef;
  @ViewChild('automaton') canvasAutomatonRef: ElementRef;

  public rule = 30;
  public rows = 30;
  public ctx: CanvasRenderingContext2D;
  public automatonCtx: CanvasRenderingContext2D;

  ngOnInit() {
    this.ctx = this.canvasRulesRef.nativeElement.getContext('2d');
    this.automatonCtx = this.canvasAutomatonRef.nativeElement.getContext('2d');
    this.updateView();
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
    this.automatonCtx.fillStyle = 'white';
    this.automatonCtx.fillRect(0, 0, 600, 320)
    // print automaton with rule and amount of rows
    // the first row has 1 in the middle
    let currentRow: boolean[] = Array(2 * rows - 1).fill(false);
    currentRow[rows - 1] = true;

    const width = Math.min(Math.floor(600 / (2 * rows - 1)), 20);
    const offset = Math.floor((600 - (2 * rows - 1) * width) / 2);

    // amount of cells in each row
    // we make them intentionally wider so the outcome is not influenced by edges

    for (let i = 0; i < rows; ++i) {
      this.renderAutomatonRow(currentRow, i, width, offset);
      currentRow = this.nextRow(currentRow)
    }
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
      nextRow[i] = this.nextCell(4 * row[2] + 2 * row[1] + 1 * row[0]);
      row.shift();
    }

    return nextRow;
  }


/*
def nextCell(rule: int, three: int):
    "given a rule and three original cells, count the outcome of the automaton"
    return (rule >> three) % 2

def nextRow(length: int, row: int, rule: int) -> int:
    "given a row lenght, representation of its state as integer and rule"
    "count the next row"
    next = 0
    row = row << 1

    for i in range(length):
        next += nextCell(rule, row % 8) * 2 ** i
        row = row >> 1

    return next

def printRow(row: int, length: int):
    "print a cellular automaton row"

    a = '{0:0' + str(length) + 'b}'
    print(a.format(row))

def automaton(rule: int, rows: int):
    "print automaton with rule and amount of rows"

    # amount of cells in each row
    # we make them intentionally wider so the outcome is not influenced by edges
    cells_no = 4 * rows - 3

    # the first row has 1 in the middle
    current_row = 2 ** (2 * rows - 2)

    for i in range(rows):
        trimmed_row = (current_row >> (rows - 1)) % (2 ** (2 * rows - 1))
        printRow(trimmed_row, 2 * rows - 1)
        current_row = nextRow(cells_no, current_row, rule)
        */
