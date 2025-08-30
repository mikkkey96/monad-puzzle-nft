import React, { useState, useEffect } from 'react'

interface Piece {
  id: number
  position: number
}

const PuzzleGame: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [pieces, setPieces] = useState<Piece[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [moves, setMoves] = useState(0)

  useEffect(() => {
    const initialPieces: Piece[] = []
    for (let i = 0; i < 9; i++) {
      initialPieces.push({ id: i, position: i })
    }

    const shuffledPieces = [...initialPieces]
    for (let i = shuffledPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPieces[i].position, shuffledPieces[j].position] = 
      [shuffledPieces[j].position, shuffledPieces[i].position]
    }
    setPieces(shuffledPieces)
  }, [])

  useEffect(() => {
    if (pieces.length === 0) return
    const completed = pieces.every(piece => piece.id === piece.position)
    if (completed && !isCompleted) {
      setIsCompleted(true)
      setTimeout(() => onComplete(), 1500)
    }
  }, [pieces, onComplete, isCompleted])

  const handleClick = (clickedId: number) => {
    if (isCompleted) return

    if (selectedId === null) {
      setSelectedId(clickedId)
    } else if (selectedId === clickedId) {
      setSelectedId(null)
    } else {
      setPieces(prevPieces => {
        const newPieces = prevPieces.map(p => ({ ...p }))
        const piece1 = newPieces.find(p => p.id === selectedId)!
        const piece2 = newPieces.find(p => p.id === clickedId)!
        const tempPosition = piece1.position
        piece1.position = piece2.position
        piece2.position = tempPosition
        return newPieces
      })
      setSelectedId(null)
      setMoves(prev => prev + 1)
    }
  }

  const sortedForDisplay = [...pieces].sort((a, b) => a.position - b.position)

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white',
      padding: '20px 10px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Компактный заголовок */}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h1 style={{
          fontSize: '2.2rem',
          marginBottom: '8px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🧩 Puzzle Challenge
        </h1>
        <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '8px' }}>
          Solve the puzzle to unlock your NFT!
        </p>
        <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
          Moves: {moves} | {selectedId !== null ? 'Click another piece to swap' : 'Click a piece to select it'}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
        
        {/* Игровое поле - компактное */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '20px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 85px)',
            gridTemplateRows: 'repeat(3, 85px)',
            gap: '3px',
            backgroundColor: '#2d3748',
            padding: '6px',
            borderRadius: '12px'
          }}>
            {sortedForDisplay.map((piece) => (
              <div
                key={piece.id}
                onClick={() => handleClick(piece.id)}
                style={{
                  width: '85px',
                  height: '85px',
                  backgroundImage: 'url(https://harlequin-splendid-lamprey-309.mypinata.cloud/ipfs/bafybeiaslatueu3z6n5vxtmgnqnrrfrrnryvomlwoutxvoftcj4eegwjpu)', // 🔥 ЗАМЕНИ НА СВОЮ ССЫЛКУ
                  backgroundSize: '255px 255px', // 3x85 = 255px
                  backgroundPosition: `${-(piece.id % 3) * 85}px ${-Math.floor(piece.id / 3) * 85}px`,
                  borderRadius: '6px',
                  cursor: isCompleted ? 'default' : 'pointer',
                  border: selectedId === piece.id ? '3px solid #FFD700' : '2px solid rgba(255,255,255,0.3)',
                  transition: 'all 0.2s ease',
                  transform: selectedId === piece.id ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: selectedId === piece.id ? 
                    '0 6px 20px rgba(255, 215, 0, 0.6)' : 
                    '0 2px 8px rgba(0,0,0,0.3)',
                  overflow: 'hidden'
                }}
              />
            ))}
          </div>
        </div>

        {/* Боковая панель с информацией */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '15px',
          minWidth: '200px'
        }}>
          
          {/* Состояние игры */}
          {isCompleted ? (
            <div style={{
              backgroundColor: 'rgba(40, 167, 69, 0.2)',
              border: '2px solid #28a745',
              borderRadius: '15px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem' }}>
                🎉 Solved!
              </h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}>
                Completed in {moves} moves!
              </p>
              <div style={{
                fontSize: '1rem',
                fontWeight: 'bold',
                color: '#28a745'
              }}>
                ✅ NFT Unlocked!
              </div>
            </div>
          ) : (
            <div style={{
              backgroundColor: 'rgba(255, 193, 7, 0.2)',
              border: '1px solid rgba(255, 193, 7, 0.5)',
              borderRadius: '15px',
              padding: '15px'
            }}>
              <div style={{ fontSize: '0.85rem', opacity: 0.9, textAlign: 'center' }}>
                💡 <strong>How to play:</strong><br />
                Click a piece to select it, then click another to swap positions.
              </div>
            </div>
          )}

          {/* Кнопка сброса */}
          <button
            onClick={() => {
              const newPieces = pieces.map(p => ({ ...p }))
              for (let i = newPieces.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newPieces[i].position, newPieces[j].position] = 
                [newPieces[j].position, newPieces[i].position]
              }
              setPieces(newPieces)
              setSelectedId(null)
              setMoves(0)
              setIsCompleted(false)
            }}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.3)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
            }}
          >
            🔄 Shuffle Again
          </button>
        </div>
      </div>
    </div>
  )
}

export default PuzzleGame
