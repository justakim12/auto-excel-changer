import * as XLSX from 'xlsx'

export const processExcel = (file: File, setFileData: (data: any) => void) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const data = new Uint8Array(e.target!.result as ArrayBuffer)
    const workbook = XLSX.read(data, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const originalData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

    // Define what you want to process
    const modifiedData = addExcelColumns(originalData)

    const newWorkbook = XLSX.utils.book_new()
    const newWorksheet = XLSX.utils.aoa_to_sheet(modifiedData)
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName)
    const newExcelData = XLSX.write(newWorkbook, { type: 'array', bookType: 'xlsx' })
    const newExcelFile = new Blob([newExcelData], { type: 'application/octet-stream' })
    setFileData(newExcelFile)
  }
  reader.readAsArrayBuffer(file)
}

function addExcelColumns(originalData: any[]): any[] {
  return originalData.map((row: any, index: number) => {
    if (index === 0) {
      row.push('sum results')
    } else {
      row.push(row[0] + row[1])
    }
    return row
  })
}

export const downloadExcel = (fileData: any) => {
  const url = window.URL.createObjectURL(new Blob([fileData]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'modified.xlsx')
  document.body.appendChild(link)
  link.click()
}
