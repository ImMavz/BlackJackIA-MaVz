"use client"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  SpadeIcon as Spades,
  HeartIcon as Hearts,
  DiamondIcon as Diamonds,
  ClubIcon as Clubs,
} from "lucide-react"

type Suit = "spades" | "hearts" | "diamonds" | "clubs"
type CardValue = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K"

interface PlayingCard {
  suit: Suit
  value: CardValue
  id: string
}

type GameState = "menu" | "game" | "rules"
type GamePhase = "dealing" | "player-turn" | "dealer-turn" | "game-over"

const suits: { [key in Suit]: { icon: any; color: string } } = {
  spades: { icon: Spades, color: "text-black" },
  hearts: { icon: Hearts, color: "text-red-500" },
  diamonds: { icon: Diamonds, color: "text-red-500" },
  clubs: { icon: Clubs, color: "text-black" },
}

const createDeck = (): PlayingCard[] => {
  const deck: PlayingCard[] = []
  const suitKeys: Suit[] = ["spades", "hearts", "diamonds", "clubs"]
  const values: CardValue[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

  suitKeys.forEach((suit) => {
    values.forEach((value) => {
      deck.push({
        suit,
        value,
        id: `${suit}-${value}-${Math.random()}`,
      })
    })
  })

  return deck.sort(() => Math.random() - 0.5)
}

const getCardValue = (card: PlayingCard): number => {
  if (card.value === "A") return 11
  if (["J", "Q", "K"].includes(card.value)) return 10
  return Number.parseInt(card.value)
}

const calculateHandValue = (hand: PlayingCard[]): number => {
  let value = 0
  let aces = 0

  hand.forEach((card) => {
    if (card.value === "A") {
      aces++
      value += 11
    } else if (["J", "Q", "K"].includes(card.value)) {
      value += 10
    } else {
      value += Number.parseInt(card.value)
    }
  })

  while (value > 21 && aces > 0) {
    value -= 10
    aces--
  }

  return value
}

const PlayingCardComponent = ({
  card,
  isHidden = false,
  animationDelay = 0,
}: {
  card: PlayingCard
  isHidden?: boolean
  animationDelay?: number
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), animationDelay)
    return () => clearTimeout(timer)
  }, [animationDelay])

  const SuitIcon = suits[card.suit].icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay / 1000, duration: 0.5, ease: "easeOut" }}
      className="w-20 h-28 bg-white border-2 border-gray-300 rounded-lg shadow-lg flex flex-col justify-between p-2"
    >
      {isHidden ? (
        <div className="w-full h-full bg-blue-600 rounded flex items-center justify-center">
          <div className="w-8 h-8 bg-blue-800 rounded"></div>
        </div>
      ) : (
        <>
          <div className={`flex items-center gap-1 ${suits[card.suit].color}`}>
            <span className="text-sm font-bold">{card.value}</span>
            <SuitIcon className="w-3 h-3" />
          </div>
          <div className={`flex justify-center ${suits[card.suit].color}`}>
            <SuitIcon className="w-8 h-8" />
          </div>
          <div className={`flex items-center gap-1 rotate-180 ${suits[card.suit].color}`}>
            <span className="text-sm font-bold">{card.value}</span>
            <SuitIcon className="w-3 h-3" />
          </div>
        </>
      )}
    </motion.div>
  )
}

export default function BlackjackGame() {
  const [gameState, setGameState] = useState<GameState>("menu")
  const [gamePhase, setGamePhase] = useState<GamePhase>("dealing")
  const [deck, setDeck] = useState<PlayingCard[]>([])
  const [playerHand, setPlayerHand] = useState<PlayingCard[]>([])
  const [dealerHand, setDealerHand] = useState<PlayingCard[]>([])
  const [gameResult, setGameResult] = useState<string>("")
  const [isDealing, setIsDealing] = useState(false)

  const startNewGame = () => {
    const newDeck = createDeck()
    setDeck(newDeck)
    setPlayerHand([])
    setDealerHand([])
    setGameResult("")
    setGamePhase("dealing")
    setGameState("game")
    setIsDealing(true)

    // Simular el reparto inicial con animación
    setTimeout(() => {
      setPlayerHand([newDeck[0]])
      setTimeout(() => {
        setDealerHand([newDeck[1]])
        setTimeout(() => {
          setPlayerHand([newDeck[0], newDeck[2]])
          setTimeout(() => {
            setDealerHand([newDeck[1], newDeck[3]])
            setDeck(newDeck.slice(4))
            setIsDealing(false)
            setGamePhase("player-turn")
          }, 600)
        }, 600)
      }, 600)
    }, 600)
  }

  const hit = () => {
    if (gamePhase !== "player-turn" || deck.length === 0) return

    const newCard = deck[0]
    const newPlayerHand = [...playerHand, newCard]
    setPlayerHand(newPlayerHand)
    setDeck(deck.slice(1))

    const playerValue = calculateHandValue(newPlayerHand)
    if (playerValue > 21) {
      setGameResult("¡Te pasaste! Dealer gana")
      setGamePhase("game-over")
    }
  }

  const stand = () => {
    setGamePhase("dealer-turn")

    // Simular el turno del dealer
    setTimeout(() => {
      const currentDealerHand = [...dealerHand]
      let currentDeck = [...deck]

      const dealerPlay = () => {
        const dealerValue = calculateHandValue(currentDealerHand)

        if (dealerValue < 17) {
          currentDealerHand.push(currentDeck[0])
          currentDeck = currentDeck.slice(1)
          setDealerHand([...currentDealerHand])
          setDeck([...currentDeck])
          setTimeout(dealerPlay, 1000)
        } else {
          // Determinar ganador
          const playerValue = calculateHandValue(playerHand)
          const finalDealerValue = calculateHandValue(currentDealerHand)

          if (finalDealerValue > 21) {
            setGameResult("¡Dealer se pasó! Tú ganas")
          } else if (playerValue > finalDealerValue) {
            setGameResult("¡Tú ganas!")
          } else if (finalDealerValue > playerValue) {
            setGameResult("Dealer gana")
          } else {
            setGameResult("¡Empate!")
          }
          setGamePhase("game-over")
        }
      }

      dealerPlay()
    }, 1000)
  }

  const MenuScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center">
      <Card className="w-96 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-green-800">🃏 BLACKJACK</CardTitle>
          <CardDescription className="text-lg">Juego con IA</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={startNewGame} className="w-full h-12 text-lg bg-green-600 hover:bg-green-700">
            🎮 Jugar
          </Button>
          <Button onClick={() => setGameState("rules")} variant="outline" className="w-full h-12 text-lg">
            📖 Cómo Jugar
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const RulesScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setGameState("menu")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-2xl">📖 Cómo Jugar Blackjack</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">🎯 Objetivo</h3>
            <p>Conseguir una mano con valor lo más cercano posible a 21 sin pasarse.</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-2">🃏 Valores de las Cartas</h3>
            <ul className="space-y-1">
              <li>
                • <strong>As:</strong> Vale 1 u 11 (el que más convenga)
              </li>
              <li>
                • <strong>Figuras (J, Q, K):</strong> Valen 10
              </li>
              <li>
                • <strong>Números:</strong> Su valor nominal
              </li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-2">🎮 Cómo Jugar</h3>
            <ol className="space-y-1">
              <li>1. Recibes 2 cartas iniciales</li>
              <li>2. El dealer también recibe 2 cartas (1 oculta)</li>
              <li>
                3. Puedes <strong>Pedir carta</strong> o <strong>Plantarte</strong>
              </li>
              <li>4. Si te pasas de 21, pierdes automáticamente</li>
              <li>5. El dealer debe pedir carta si tiene menos de 17</li>
            </ol>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-2">🏆 Ganar</h3>
            <ul className="space-y-1">
              <li>• Tener más puntos que el dealer sin pasarse de 21</li>
              <li>• Que el dealer se pase de 21</li>
              <li>• Conseguir Blackjack (21 con 2 cartas)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const GameScreen = () => {
    const playerValue = calculateHandValue(playerHand)
    const dealerValue = calculateHandValue(dealerHand)

    return (
      <div className="min-h-screen bg-green-900 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl bg-green-800 rounded-[40px] shadow-inner border-[6px] border-yellow-700 p-6 md:p-10 space-y-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Button variant="ghost" className="text-white hover:bg-green-700" onClick={() => setGameState("menu")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Menú
            </Button>
            <h1 className="text-3xl font-bold text-white">🃏 BLACKJACK</h1>
            <div></div>
          </div>

          {/* Dealer Section */}
          <div className="bg-green-700 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">🤖 Dealer</h2>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {gamePhase === "player-turn" && dealerHand.length > 1 ? "?" : dealerValue}
              </Badge>
            </div>
            <div className="flex gap-2 justify-center">
              {dealerHand.map((card, index) => (
                <PlayingCardComponent
                  key={card.id}
                  card={card}
                  isHidden={gamePhase === "player-turn" && index === 1}
                  animationDelay={index * 600}
                />
              ))}
            </div>
          </div>

          {/* Player Section */}
          <div className="bg-green-700 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">👤 Jugador</h2>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {playerValue}
              </Badge>
            </div>
            <div className="flex gap-2 justify-center">
              {playerHand.map((card, index) => (
                <PlayingCardComponent key={card.id} card={card} animationDelay={index * 600} />
              ))}
            </div>
          </div>

          {/* Game Controls */}
          <div className="text-center">
            {isDealing && <div className="text-white text-xl mb-4">🎴 Repartiendo cartas...</div>}

            {gamePhase === "player-turn" && (
              <div className="space-x-4">
                <Button onClick={hit} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  🃏 Pedir Carta
                </Button>
                <Button onClick={stand} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg">
                  ✋ Plantarse
                </Button>
              </div>
            )}

            {gamePhase === "dealer-turn" && <div className="text-white text-xl">🤖 Turno del Dealer...</div>}

            {gamePhase === "game-over" && (
              <div className="space-y-4">
                <div className="text-2xl font-bold text-white">{gameResult}</div>
                <Button onClick={startNewGame} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                  🔄 Nueva Partida
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {gameState === "menu" && <MenuScreen />}
      {gameState === "rules" && <RulesScreen />}
      {gameState === "game" && <GameScreen />}
    </div>
  )
}
