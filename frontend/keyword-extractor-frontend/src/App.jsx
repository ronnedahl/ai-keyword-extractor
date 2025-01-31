
import { useState } from 'react'

function App() {
  const [text, setText] = useState('')
  const [keywords, setKeywords] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [docsMessage, setDocsMessage] = useState('')
  const GOOGLE_DOC_ID = '1N88_UEt040urHeDBfh16KVYE3yq7ukIt4sW7LbA1-wY'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setDocsMessage('')
   
    try {
      const response = await fetch('http://localhost:5000/keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })
      
      if (!response.ok) {
        throw new Error('Något gick fel vid anropet till servern')
      }
      
      const data = await response.json()
      setKeywords(data.keywords.split(',').map(keyword => keyword.trim()))
     
      const docsResponse = await fetch('http://localhost:5000/write-to-docs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: GOOGLE_DOC_ID
        })
      })
      
      if (!docsResponse.ok) {
        throw new Error('Kunde inte spara till Google Docs')
      }
      
      const docsData = await docsResponse.json()
      if (docsData.success) {
        setDocsMessage('Nyckelorden har sparats i Google Docs!')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-emerald-400">
          AI NYCKELORDS
          <br />
          EXTRAHERARE
        </h1>
       
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-4 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 min-h-32 focus:outline-none focus:border-emerald-400"
              placeholder="Skriv eller klistra in din text här..."
              required
            />
          </div>
         
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 text-white py-3 px-4 rounded-lg hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Bearbetar...' : 'Extrahera nyckelord'}
          </button>
        </form>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {docsMessage && (
          <div className="bg-emerald-900/50 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-lg mb-4">
            {docsMessage}
          </div>
        )}

        {keywords.length > 0 && (
          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
            <h2 className="text-xl font-semibold mb-3 text-emerald-400">EXTRAHERADE NYCKELORD AI:</h2>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-gray-700 px-3 py-1 rounded-full text-gray-200"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App