import { useState, useEffect } from 'react'
import { WagmiProvider, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { monadTestnet } from './config/chains'
import PuzzleGame from './components/PuzzleGame'
import NFTMinter from './components/NFTMinter'
import '@rainbow-me/rainbowkit/styles.css'
import './App.css'

const config = getDefaultConfig({
  appName: 'Monad NFT Minter',
  projectId: 'YOUR_PROJECT_ID',
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
})

const queryClient = new QueryClient()

function App() {
  const [puzzleCompleted, setPuzzleCompleted] = useState(false)

  useEffect(() => {
    const completed = localStorage.getItem('monadPuzzleCompleted')
    if (completed === 'true') {
      setPuzzleCompleted(true)
    }
  }, [])

  const handlePuzzleComplete = () => {
    setPuzzleCompleted(true)
    localStorage.setItem('monadPuzzleCompleted', 'true')
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {!puzzleCompleted ? (
            <PuzzleGame onComplete={handlePuzzleComplete} />
          ) : (
            <NFTMinter />
          )}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
