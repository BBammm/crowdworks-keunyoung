import PdfViewer from './components/PdfViewer'
import JsonList from './components/JsonList'
import pdfFile from './assets/1.report.pdf'

function App() {
  return (
    <div className="h-screen flex">
      <div className="w-1/2 border-r">
        <PdfViewer fileUrl={pdfFile} />
      </div>
      <div className="w-1/2 p-4">
        <JsonList />
      </div>
    </div>
  )
}

export default App