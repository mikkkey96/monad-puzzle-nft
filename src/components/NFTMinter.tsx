import React, { useState, useEffect } from 'react'
import { useAccount, useContractRead, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { parseEther } from 'viem'

const CONTRACT_ABI = [
  {
    inputs: [],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "MAX_SUPPLY",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "hasMinted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  }
] as const

const CONTRACT_ADDRESS = '0xC97718f4Bc76d242470A0C78b885bc543aDD75E8'

// Улучшенный Twitter Gating Component
const TwitterVerification: React.FC<{ onVerified: (username: string) => void }> = ({ onVerified }) => {
  const [step, setStep] = useState<'instructions' | 'form' | 'verified'>('instructions')
  const [username, setUsername] = useState('')

  const handleVerification = () => {
    if (username.trim()) {
      localStorage.setItem('twitterVerified', 'true')
      localStorage.setItem('twitterUsername', username)
      onVerified(username)
      setStep('verified')
    }
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(29, 161, 242, 0.2), rgba(29, 161, 242, 0.35))',
      border: '3px solid #1da1f2',
      borderRadius: '20px',
      padding: '30px',
      marginBottom: '25px',
      textAlign: 'center',
      color: 'white',
      boxShadow: '0 10px 30px rgba(29, 161, 242, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backdropFilter: 'blur(10px)',
      position: 'relative'
    }}>
      
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '15px',
        right: '20px',
        fontSize: '2rem',
        opacity: 0.3
      }}>
        🐦
      </div>

      {step === 'instructions' && (
        <>
          <h3 style={{ 
            margin: '0 0 20px 0', 
            fontSize: '2rem', 
            fontWeight: '700',
            textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
            color: '#ffffff'
          }}>
            🔐 Twitter Verification Required
          </h3>
          
          <p style={{ 
            fontSize: '1.1rem', 
            marginBottom: '25px', 
            lineHeight: '1.6',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            color: '#f0f8ff',
            fontWeight: '500'
          }}>
            Help us spread the word about <strong style={{ color: '#87ceeb' }}>Monad Puzzle NFT</strong> to unlock minting!
          </p>
          
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '25px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(5px)'
          }}>
            <div style={{ 
              fontSize: '1rem', 
              textAlign: 'left',
              lineHeight: '2',
              color: '#ffffff',
              fontWeight: '600'
            }}>
              <div style={{ 
                fontSize: '1.1rem', 
                marginBottom: '15px', 
                textAlign: 'center',
                color: '#87ceeb',
                fontWeight: '700'
              }}>
                📋 Required Actions:
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <span style={{ marginRight: '10px' }}>1️⃣</span>
                <a 
                  href="https://twitter.com/intent/like?tweet_id=1961793242220941435" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#87ceeb', 
                    textDecoration: 'none',
                    fontWeight: '600',
                    borderBottom: '2px solid #87ceeb',
                    paddingBottom: '2px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#ffffff'
                    e.currentTarget.style.borderBottomColor = '#ffffff'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#87ceeb'
                    e.currentTarget.style.borderBottomColor = '#87ceeb'
                  }}
                >
                  👍 Like our announcement post
                </a>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <span style={{ marginRight: '10px' }}>2️⃣</span>
                <a 
                  href="https://twitter.com/intent/retweet?tweet_id=1961793242220941435" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#87ceeb', 
                    textDecoration: 'none',
                    fontWeight: '600',
                    borderBottom: '2px solid #87ceeb',
                    paddingBottom: '2px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#ffffff'
                    e.currentTarget.style.borderBottomColor = '#ffffff'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#87ceeb'
                    e.currentTarget.style.borderBottomColor = '#87ceeb'
                  }}
                >
                  🔄 Retweet our announcement post
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep('form')}
            style={{
              background: 'linear-gradient(45deg, #1da1f2, #0d8bd9)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '15px 35px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 20px rgba(29, 161, 242, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)'
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(29, 161, 242, 0.6)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(29, 161, 242, 0.4)'
            }}
          >
            ✅ I Completed Both Tasks
          </button>
        </>
      )}

      {step === 'form' && (
        <>
          <h4 style={{ 
            margin: '0 0 20px 0', 
            fontSize: '1.8rem', 
            fontWeight: '700', 
            color: '#ffffff',
            textShadow: '2px 2px 4px rgba(0,0,0,0.4)'
          }}>
            Almost There! 🎉
          </h4>
          
          <p style={{ 
            fontSize: '1rem', 
            marginBottom: '25px', 
            opacity: 0.9,
            color: '#f0f8ff',
            fontWeight: '500',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}>
            Enter your Twitter username to complete verification:
          </p>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '15px', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666',
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}>
                @
              </span>
              <input
                type="text"
                placeholder="your_username"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace('@', ''))}
                style={{
                  padding: '15px 20px 15px 35px',
                  borderRadius: '10px',
                  border: '3px solid #74acff',
                  fontSize: '1rem',
                  minWidth: '200px',
                  color: '#1a1a1a',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  fontWeight: '600',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1da1f2'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(29, 161, 242, 0.3)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#74acff'
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)'
                }}
              />
            </div>
            
            <button
              onClick={handleVerification}
              disabled={!username.trim()}
              style={{
                background: username.trim() ? 
                  'linear-gradient(45deg, #1da1f2, #0d8bd9)' : 
                  'linear-gradient(45deg, #999, #777)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '15px 25px',
                cursor: username.trim() ? 'pointer' : 'not-allowed',
                fontWeight: '700',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: username.trim() ? 
                  '0 6px 15px rgba(29, 161, 242, 0.4)' : 
                  '0 4px 10px rgba(0,0,0,0.2)'
              }}
              onMouseOver={(e) => {
                if (username.trim()) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(29, 161, 242, 0.6)'
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = username.trim() ? 
                  '0 6px 15px rgba(29, 161, 242, 0.4)' : 
                  '0 4px 10px rgba(0,0,0,0.2)'
              }}
            >
              Verify ✨
            </button>
          </div>
        </>
      )}

      {step === 'verified' && (
        <div style={{ 
          color: '#28a745', 
          fontWeight: '700', 
          fontSize: '1.3rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
          lineHeight: '1.5'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎉</div>
          <div style={{ color: '#ffffff', marginBottom: '10px' }}>
            Twitter Verification Complete!
          </div>
          <div style={{ fontSize: '1rem', color: '#87ceeb' }}>
            Thanks <strong>@{username}</strong> for helping spread the word!
          </div>
        </div>
      )}
    </div>
  )
}

const NFTMinter: React.FC = () => {
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [currentSupply, setCurrentSupply] = useState(0)
  const [maxSupply, setMaxSupply] = useState(10000)
  const [userAlreadyMinted, setUserAlreadyMinted] = useState(false)
  const [twitterVerified, setTwitterVerified] = useState(false)
  const [twitterUsername, setTwitterUsername] = useState('')

  // Проверяем сохраненную Twitter верификацию
  useEffect(() => {
    const verified = localStorage.getItem('twitterVerified')
    const savedUsername = localStorage.getItem('twitterUsername')
    if (verified === 'true' && savedUsername) {
      setTwitterVerified(true)
      setTwitterUsername(savedUsername)
    }
  }, [])

  const { data: hasMintedData, refetch: refetchHasMinted } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'hasMinted',
    args: address ? [address] : undefined,
  })

  const { data: totalSupplyData, refetch: refetchSupply } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'totalSupply',
  })

  const { data: maxSupplyData } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'MAX_SUPPLY',
  })

  useEffect(() => {
    if (hasMintedData !== undefined) {
      setUserAlreadyMinted(!!hasMintedData)
    }
    if (totalSupplyData) {
      setCurrentSupply(Number(totalSupplyData))
    }
    if (maxSupplyData) {
      setMaxSupply(Number(maxSupplyData))
    }
  }, [hasMintedData, totalSupplyData, maxSupplyData])

  const { writeContract, data: hash } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (isSuccess) {
      refetchSupply()
      refetchHasMinted()
      setIsLoading(false)
    }
  }, [isSuccess, refetchSupply, refetchHasMinted])

  const handleMint = async () => {
    if (!twitterVerified) {
      alert('Please complete Twitter verification first!')
      return
    }
    
    if (!isConnected) {
      alert('Please connect your wallet!')
      return
    }
    
    if (userAlreadyMinted) {
      alert('Minting limit reached: Only 1 NFT per wallet allowed!')
      return
    }

    if (currentSupply >= maxSupply) {
      alert('All NFTs have been minted!')
      return
    }

    try {
      setIsLoading(true)
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'mint',
        value: parseEther('0.01'),
      })
    } catch (error) {
      console.error('Minting error:', error)
      setIsLoading(false)
      alert('Error during NFT minting')
    }
  }

  const handleTwitterVerified = (username: string) => {
    setTwitterVerified(true)
    setTwitterUsername(username)
  }

  const progressPercentage = maxSupply > 0 ? (currentSupply / maxSupply) * 100 : 0

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white',
      padding: '20px 15px',
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
          🎨 Monad NFT Collection
        </h1>
        <p style={{ fontSize: '1rem', opacity: 0.9 }}>
          Limited NFT collection on the Monad blockchain
        </p>
      </div>

      {/* Twitter Verification */}
      {!twitterVerified && (
        <div style={{ maxWidth: '500px', width: '100%', marginBottom: '20px' }}>
          <TwitterVerification onVerified={handleTwitterVerified} />
        </div>
      )}

      {/* Кнопка подключения кошелька */}
      <div style={{ marginBottom: '25px' }}>
        <ConnectButton />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
        
        {/* NFT превью */}
        <div style={{
          width: '200px',
          height: '200px',
          borderRadius: '15px',
          backgroundImage: 'url(https://harlequin-splendid-lamprey-309.mypinata.cloud/ipfs/bafybeiaslatueu3z6n5vxtmgnqnrrfrrnryvomlwoutxvoftcj4eegwjpu)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '3px solid rgba(255,255,255,0.3)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          opacity: twitterVerified ? 1 : 0.5,
          transition: 'opacity 0.3s ease'
        }} />

        {/* Основная карточка минтинга */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '25px',
          maxWidth: '320px',
          width: '100%',
          boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
          textAlign: 'center',
          opacity: twitterVerified ? 1 : 0.7,
          transition: 'opacity 0.3s ease'
        }}>
          
          {/* Twitter Status */}
          {twitterVerified && (
            <div style={{
              backgroundColor: 'rgba(29, 161, 242, 0.2)',
              border: '1px solid #1da1f2',
              borderRadius: '10px',
              padding: '12px',
              marginBottom: '15px',
              fontSize: '0.85rem'
            }}>
              🐦 <strong>Twitter Verified:</strong> @{twitterUsername}
            </div>
          )}

          {/* Прогресс минтинга */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>
              📊 Mint Progress
            </h3>
            
            <div style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>
              {currentSupply.toLocaleString()} / {maxSupply.toLocaleString()}
            </div>
            
            <div style={{
              width: '100%',
              height: '10px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '5px',
              overflow: 'hidden',
              marginBottom: '8px'
            }}>
              <div style={{
                height: '100%',
                width: `${progressPercentage}%`,
                background: 'linear-gradient(90deg, #00ff88, #00cc6a)',
                borderRadius: '5px',
                transition: 'width 0.5s ease'
              }} />
            </div>
            
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
              {progressPercentage.toFixed(1)}% minted
            </div>
          </div>

          {/* Статус кошелька */}
          {isConnected && (
            <div style={{
              backgroundColor: userAlreadyMinted ? 
                'rgba(220, 53, 69, 0.2)' : 'rgba(40, 167, 69, 0.2)',
              borderRadius: '10px',
              padding: '12px',
              marginBottom: '15px',
              border: `1px solid ${userAlreadyMinted ? '#dc3545' : '#28a745'}`
            }}>
              <div style={{ 
                fontWeight: 'bold',
                fontSize: '0.9rem',
                color: userAlreadyMinted ? '#ff6b6b' : '#51cf66'
              }}>
                {userAlreadyMinted ? '🚫 Limit Reached (1 per wallet)' : '✅ Eligible to mint'}
              </div>
            </div>
          )}

          {/* Цена */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '4px' }}>
              💰 Mint Price
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
              0.01 MON
            </div>
          </div>

          {/* Кнопка минтинга */}
          <button
            onClick={handleMint}
            disabled={!twitterVerified || !isConnected || isLoading || isConfirming || userAlreadyMinted || currentSupply >= maxSupply}
            style={{
              background: (!twitterVerified || !isConnected || isLoading || isConfirming || userAlreadyMinted || currentSupply >= maxSupply) ? 
                'linear-gradient(45deg, #6c757d, #5a6268)' : 
                'linear-gradient(45deg, #28a745, #20c997)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '15px 25px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: (!twitterVerified || !isConnected || isLoading || isConfirming || userAlreadyMinted || currentSupply >= maxSupply) ? 
                'not-allowed' : 'pointer',
              width: '100%',
              transition: 'all 0.3s ease',
              boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseOver={(e) => {
              if (twitterVerified && !(isLoading || isConfirming || userAlreadyMinted || currentSupply >= maxSupply) && isConnected) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)'
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)'
            }}
          >
            {!twitterVerified ? '🐦 Complete Twitter Tasks' :
             !isConnected ? '🔗 Connect Wallet' :
             userAlreadyMinted ? '🚫 Mint Limit Reached' :
             isLoading ? '⏳ Preparing...' :
             isConfirming ? '⌛ Confirming...' :
             currentSupply >= maxSupply ? '🔒 All NFTs Minted' :
             '🎨 Mint NFT'}
          </button>

          {/* Ссылка на транзакцию */}
          {hash && (
            <div style={{ marginTop: '15px' }}>
              <a 
                href={`https://testnet.monadexplorer.com/tx/${hash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#87ceeb', 
                  textDecoration: 'underline',
                  fontSize: '0.8rem'
                }}
              >
                🔍 View transaction
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Компактный футер */}
      <div style={{ 
        marginTop: '25px', 
        textAlign: 'center',
        opacity: 0.7,
        fontSize: '0.8rem'
      }}>
        Built on Monad blockchain 🚀
      </div>
    </div>
  )
}

export default NFTMinter
