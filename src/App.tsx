import React, { useState } from 'react'
import { InboxOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { Button, message, Upload } from 'antd'
import './App.css'
import { downloadExcel, processExcel } from './utils/excelUtils'

const { Dragger } = Upload

const props: UploadProps = {
  name: 'file',
  multiple: false,
  accept: '.xlsx',
  onChange(info) {
    const { status } = info.file
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`)
    }
  }
}

const App: React.FC = () => {
  const [fileData, setFileData] = useState<any>(null)

  const handleExcelUpload = (file: File) => {
    processExcel(file, setFileData)
  }

  return (
    <>
      <Dragger {...props} beforeUpload={handleExcelUpload}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">Support for a single excel</p>
      </Dragger>
      <div className="download-button-container">
        {fileData && (
          <Button type="primary" onClick={() => downloadExcel(fileData)}>
            Download Modified Excel
          </Button>
        )}
      </div>
    </>
  )
}

export default App
