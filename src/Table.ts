import { MarkdownLexer } from "./MarkdownLexer";
import * as MarkdownParser from "./MarkdownParser";
import { SpreadSheetLexer } from "./SpreadSheetLexer";
import * as SpreadSheetParser from "./SpreadSheetParser";
export enum ColumnAlign {
  Left,
  Right,
  Center,
}

export class HeaderColumn {
  text: string;
  align: ColumnAlign;

  constructor(text: string, align?: ColumnAlign) {
    this.text = text;
    this.align = align ? align : ColumnAlign.Left;
  }
}

export class DataColumn {
  text: string;

  constructor(text: string) {
    this.text = text;
  }
}

export class Table {
  headerColumns: HeaderColumn[];
  rows: DataColumn[][];

  constructor() {
    this.headerColumns = [];
    this.rows = [[]];
  }

  public static fromMarkdown(input: string): Table {
    const lexer = new MarkdownLexer();
    const tokens = lexer.lex(input);
    const table = MarkdownParser.parse(tokens);
    return table;
  }

  public toMarkdown(): string {
    return MarkdownParser.toString(this);
  }

  public static isMarkdown(input: string): boolean {
    try {
      Table.fromMarkdown(input);
      return true;
    } catch {
      return false;
    }
  }

  public static fromSpreadSheet(input: string): Table {
    const lexer = new SpreadSheetLexer();
    const tokens = lexer.lex(input);
    const table = SpreadSheetParser.parse(tokens);
    return table;
  }

  public toSpreadSheet(): string {
    return SpreadSheetParser.toString(this);
  }

  public static isSpreadSheet(input: string): boolean {
    try {
      Table.fromSpreadSheet(input);
      return true;
    } catch {
      return false;
    }
  }
}
