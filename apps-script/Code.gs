/**
 * Backend de "Jaz & Agus · Finanzas"
 * ----------------------------------
 * Pegá este código en Extensiones → Apps Script de tu Google Sheet.
 * Crea solo 3 pestañas: Gastos, Ahorros, Metas (se generan solas).
 * Publicá como Aplicación web (ver INSTRUCCIONES.md) y pegá la URL
 * en src/config.js (APPS_SCRIPT_URL).
 */

const SHEETS = {
  expenses: { name: 'Gastos',  headers: ['id', 'date', 'description', 'category', 'amount', 'who'] },
  savings:  { name: 'Ahorros', headers: ['id', 'date', 'description', 'amount', 'who', 'goal', 'type'] },
  goals:    { name: 'Metas',   headers: ['id', 'name', 'target'] },
}

function getSheet(key) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const def = SHEETS[key]
  let sh = ss.getSheetByName(def.name)
  if (!sh) {
    sh = ss.insertSheet(def.name)
    sh.appendRow(def.headers)
    sh.getRange(1, 1, 1, def.headers.length).setFontWeight('bold')
    sh.setFrozenRows(1)
  }
  return sh
}

function readAll(key) {
  const sh = getSheet(key)
  const values = sh.getDataRange().getValues()
  if (values.length < 2) return []
  const headers = values[0]
  return values.slice(1).map(function (row) {
    const obj = {}
    headers.forEach(function (h, i) { obj[h] = row[i] })
    // normalizar fecha a YYYY-MM-DD
    if (obj.date instanceof Date) {
      obj.date = Utilities.formatDate(obj.date, Session.getScriptTimeZone(), 'yyyy-MM-dd')
    }
    return obj
  })
}

function appendRow(key, row) {
  const sh = getSheet(key)
  const headers = SHEETS[key].headers
  sh.appendRow(headers.map(function (h) { return row[h] !== undefined ? row[h] : '' }))
}

function removeById(key, id) {
  const sh = getSheet(key)
  const values = sh.getDataRange().getValues()
  for (var r = values.length - 1; r >= 1; r--) {
    if (String(values[r][0]) === String(id)) sh.deleteRow(r + 1)
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
}

function doGet() {
  return json({
    expenses: readAll('expenses'),
    savings: readAll('savings'),
    goals: readAll('goals'),
  })
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents)
    switch (body.action) {
      case 'getAll':
        return json({
          expenses: readAll('expenses'),
          savings: readAll('savings'),
          goals: readAll('goals'),
        })
      case 'addExpense':
        appendRow('expenses', body.row); return json({ ok: true })
      case 'addSaving':
        appendRow('savings', body.row); return json({ ok: true })
      case 'addGoal':
        appendRow('goals', body.row); return json({ ok: true })
      case 'remove':
        var key = body.type === 'expense' ? 'expenses' : body.type === 'saving' ? 'savings' : 'goals'
        removeById(key, body.id); return json({ ok: true })
      default:
        return json({ error: 'Acción desconocida: ' + body.action })
    }
  } catch (err) {
    return json({ error: String(err) })
  }
}
