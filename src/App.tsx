import PdfViewer from './components/PdfViewer'
import pdfFile from './assets/1.report.pdf'

function App() {
  return (
    <div className="h-screen flex">
      <div className="w-1/2 border-r">
        <PdfViewer fileUrl={pdfFile} />
      </div>
      <div className="w-1/2 p-4">
        {/* 나중에 JSON 리스트 들어올 자리 */}
        <div>JSON 리스트가 여기에 렌더링됩니다</div>
      </div>
    </div>
  )
}

export default App