// import './App.css'
import { toast, Toaster } from 'sonner'
import { TriathlonPage } from './components/TriathlonPage'
import { ErrorHandler } from './utils/errorHandler'
import { ThemeProvider } from "@/components/ThemeProvider"

function App() {
  // Global error display function
  ErrorHandler.setErrorDisplayFn((message: string) => {
    toast.error(message)
  })

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Toaster />
        <TriathlonPage />
      </div>
    </ThemeProvider>
  )
}

export default App
