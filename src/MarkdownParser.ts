import { ColumnAlign, DataColumn, HeaderColumn, Table } from "./Table";
import * as token from "./Token";

export function parse(tokenBlocks: token.Token[][]): Table {
  const table = new Table();

  table.headerColumns = parseHeader(tokenBlocks);
  table.rows = parseRows(tokenBlocks.slice(2));

  return table;
}

export function toString(table: Table): string {
  const lines: string[] = [];

  const headerTexts =
    "| " + table.headerColumns.map(c => c.text).join(" | ") + " |";
  lines.push(headerTexts);

  const headerAligns =
    "| " +
    table.headerColumns.map(c => alignToString(c.align)).join(" | ") +
    " |";
  lines.push(headerAligns);

  table.rows.forEach(row =>
    lines.push("| " + row.map(cell => cell.text).join(" | ") + " |")
  );

  return lines.join("\n");
}

function alignToString(align: ColumnAlign): string {
  switch (align) {
    case ColumnAlign.Left:
      return ":---";
    case ColumnAlign.Center:
      return ":---:";
    case ColumnAlign.Right:
      return "---:";
    default:
      return "---";
  }
}

function parseHeader(tokenBlocks: token.Token[][]): HeaderColumn[] {
  if (tokenBlocks.length < 2) {
    throw new Error("Markdown Table must have 2 lines for header");
  }

  const headerTexts = tokenBlocks[0];
  const headerAligns = tokenBlocks[1];
  if (headerTexts.length < 2) {
    throw new Error("Markdown Table must have more than 1 column for header");
  }

  if (headerTexts.length !== headerAligns.length) {
    throw new Error("Markdown Table must have same column length for header");
  }

  const colLen = headerTexts.length;

  const cols: HeaderColumn[] = [];
  for (let i = 0; i < colLen; i++) {
    const col = new HeaderColumn(headerTexts[i].literal);
    switch (headerAligns[i].type) {
      case token.Type.LALIGN:
        col.align = ColumnAlign.Left;
        break;
      case token.Type.CALIGN:
        col.align = ColumnAlign.Center;
        break;
      case token.Type.RALIGN:
        col.align = ColumnAlign.Right;
        break;
    }
    cols.push(col);
  }
  return cols;
}

function parseRows(tokenBlocks: token.Token[][]): DataColumn[][] {
  if (tokenBlocks.length === 0) {
    throw new Error("Markdown Table has no rows");
  }

  const rows: DataColumn[][] = [];

  for (let ri = 0; ri < tokenBlocks.length; ri++) {
    const row: DataColumn[] = [];

    for (let ci = 0; ci < tokenBlocks[ri].length; ci++) {
      row.push(new DataColumn(tokenBlocks[ri][ci].literal));
    }

    rows.push(row);
  }

  return rows;
}
