"use client"
import { motion } from "framer-motion"
import ThemeToggle from "@/components/ThemeToggle"
import FichasApuesta from "@/components/FichasApuestas"
import AnimatedBetChip from "@/components/AnimatedBetChip"
import PlayerChips from "@/components/PlayerChips"
import { useState, useCallback } from "react"
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
  isNew = false,
}: {
  card: PlayingCard
  isHidden?: boolean
  animationDelay?: number
  isNew?: boolean
}) => {
  const SuitIcon = suits[card.suit].icon

  return (
    <motion.div
      key={card.id}
      initial={isNew ? { opacity: 0, y: -50, rotateY: 180 } : false}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{
        delay: isNew ? 0 : animationDelay / 1000,
        duration: isNew ? 0.4 : 0.6,
        ease: "easeOut",
      }}
      className="w-20 h-28 bg-white border-2 border-gray-300 rounded-lg shadow-lg flex flex-col justify-between p-2"
    >
      {isHidden ? (
        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded flex items-center justify-center">
          <div className="w-8 h-8 bg-blue-900 rounded-full opacity-50"></div>
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
  const [balance, setBalance] = useState(1000)
  const [bet, setBet] = useState(0)
  const [showChip, setShowChip] = useState(false)
  const [wonChip, setWonChip] = useState(false)
  const [newCardIds, setNewCardIds] = useState<string[]>([])

  const addNewCard = useCallback((cardId: string) => {
    setNewCardIds((prev) => [...prev, cardId])
    setTimeout(() => {
      setNewCardIds((prev) => prev.filter((id) => id !== cardId))
    }, 500)
  }, [])

  const startNewGame = () => {
    if (bet === 0) return

    const newDeck = createDeck()
    setDeck(newDeck)
    setPlayerHand([])
    setDealerHand([])
    setGameResult("")
    setGamePhase("dealing")
    setGameState("game")
    setIsDealing(true)
    setShowChip(true)
    setWonChip(false)
    setNewCardIds([])

    // Reparto inicial más fluido
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
          }, 400)
        }, 400)
      }, 400)
    }, 400)
  }

  const hit = () => {
    if (gamePhase !== "player-turn" || deck.length === 0) return

    const newCard = deck[0]
    const newPlayerHand = [...playerHand, newCard]
    addNewCard(newCard.id)
    setPlayerHand(newPlayerHand)
    setDeck(deck.slice(1))

    const playerValue = calculateHandValue(newPlayerHand)
    if (playerValue > 21) {
      setTimeout(() => {
        setGameResult("¡Te pasaste! Dealer gana")
        setGamePhase("game-over")
        setWonChip(false)
        setTimeout(() => setShowChip(false), 1000)
        setBet(0)
      }, 500)
    }
  }

  const stand = () => {
    setGamePhase("dealer-turn")

    // Turno del dealer mejorado - sin resetear las cartas
    const dealerPlay = async () => {
      let currentDealerHand = [...dealerHand]
      let currentDeck = [...deck]

      // Esperar un poco antes de empezar
      await new Promise((resolve) => setTimeout(resolve, 800))

      while (calculateHandValue(currentDealerHand) < 17) {
        const newCard = currentDeck[0]
        currentDealerHand = [...currentDealerHand, newCard]
        currentDeck = currentDeck.slice(1)

        addNewCard(newCard.id)
        setDealerHand([...currentDealerHand])
        setDeck([...currentDeck])

        // Pausa más corta entre cartas
        await new Promise((resolve) => setTimeout(resolve, 600))
      }

      // Determinar ganador después de una pequeña pausa
      await new Promise((resolve) => setTimeout(resolve, 500))

      const dealerValue = calculateHandValue(currentDealerHand)
      const playerValue = calculateHandValue(playerHand)

      if (dealerValue > 21) {
        setGameResult("¡Dealer se pasó! Tú ganas")
        setBalance((prev) => prev + bet * 2)
        setWonChip(true)
      } else if (playerValue > dealerValue) {
        setGameResult("¡Tú ganas!")
        setBalance((prev) => prev + bet * 2)
        setWonChip(true)
      } else if (dealerValue > playerValue) {
        setGameResult("Dealer gana")
        setWonChip(false)
      } else {
        setGameResult("¡Empate!")
        setBalance((prev) => prev + bet)
        setWonChip(true)
      }

      setTimeout(() => setShowChip(false), 1500)
      setBet(0)
      setGamePhase("game-over")
    }

    dealerPlay()
  }

  const MenuScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-600 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-96 shadow-2xl bg-white dark:bg-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-green-800 dark:text-green-400">🃏 BLACKJACK</CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-300">Juego con IA</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FichasApuesta
            balance={balance}
            bet={bet}
            onApostar={(valor) => {
              if (balance >= valor) {
                setBet(bet + valor)
                setBalance(balance - valor)
              }
            }}
          />

          <Button
            onClick={startNewGame}
            className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 disabled:opacity-50"
            disabled={bet === 0}
          >
            🎮 Apostar y jugar
          </Button>

          <Button
            onClick={() => setGameState("rules")}
            variant="outline"
            className="w-full h-12 text-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
          >
            📖 Cómo Jugar
          </Button>

          <div className="flex justify-center pt-4">
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const RulesScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-600 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl bg-white dark:bg-gray-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setGameState("menu")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-2xl text-gray-800 dark:text-gray-200">📖 Cómo Jugar Blackjack</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
          <div>
            <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">🎯 Objetivo</h3>
            <p>Conseguir una mano con valor lo más cercano posible a 21 sin pasarse.</p>
          </div>

          <Separator className="dark:bg-gray-600" />

          <div>
            <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">🃏 Valores de las Cartas</h3>
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

          <Separator className="dark:bg-gray-600" />

          <div>
            <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">🎮 Cómo Jugar</h3>
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

          <Separator className="dark:bg-gray-600" />

          <div>
            <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">🏆 Ganar</h3>
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
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="relative w-full max-w-6xl mx-auto">
          <div className="bg-green-800 dark:bg-gray-800 rounded-[40px] shadow-2xl border-8 border-yellow-700 dark:border-yellow-600 p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                className="text-white dark:text-gray-200 hover:bg-green-700 dark:hover:bg-gray-700"
                onClick={() => setGameState("menu")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Menú
              </Button>
              <h1 className="text-3xl font-bold text-white dark:text-gray-200">🃏 BLACKJACK</h1>
              <div className="flex items-center gap-4">
                <div className="text-white dark:text-gray-200 text-right">
                  <div className="text-sm">Saldo: ${balance}</div>
                  <div className="text-sm">Apuesta: ${bet}</div>
                </div>
              </div>
            </div>

            {/* Dealer Section */}
            <div className="bg-green-700 dark:bg-gray-700 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white dark:text-gray-200">🤖 Dealer</h2>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {gamePhase === "player-turn" && dealerHand.length > 1 ? "?" : dealerValue}
                </Badge>
              </div>
              <div className="flex gap-3 justify-center">
                {dealerHand.map((card, index) => (
                  <PlayingCardComponent
                    key={card.id}
                    card={card}
                    isHidden={gamePhase === "player-turn" && index === 1}
                    animationDelay={index * 400}
                    isNew={newCardIds.includes(card.id)}
                  />
                ))}
              </div>
            </div>

            {/* Center betting area con ficha */}
            <div className="flex justify-center py-4 relative">
              <div className="w-32 h-32 rounded-full border-4 border-dashed border-yellow-400 dark:border-yellow-500 flex items-center justify-center">
                <span className="text-yellow-400 dark:text-yellow-500 font-bold text-sm">APUESTAS</span>
              </div>
              {/* Ficha de apuesta estática */}
              <AnimatedBetChip visible={showChip} won={wonChip} keyId={gameResult} amount={bet} />
            </div>

            {/* Player Section */}
            <div className="bg-green-700 dark:bg-gray-700 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold text-white dark:text-gray-200">👤 Jugador</h2>
                  <PlayerChips balance={balance} />
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {playerValue}
                </Badge>
              </div>
              <div className="flex gap-3 justify-center">
                {playerHand.map((card, index) => (
                  <PlayingCardComponent
                    key={card.id}
                    card={card}
                    animationDelay={index * 400}
                    isNew={newCardIds.includes(card.id)}
                  />
                ))}
              </div>
            </div>

            {/* Game Controls */}
            <div className="text-center space-y-4">
              {isDealing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white dark:text-gray-200 text-xl"
                >
                  🎴 Repartiendo cartas...
                </motion.div>
              )}

              {gamePhase === "player-turn" && (
                <div className="flex gap-4 justify-center">
                  <Button onClick={hit} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                    🃏 Pedir Carta
                  </Button>
                  <Button onClick={stand} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg">
                    ✋ Plantarse
                  </Button>
                </div>
              )}

              {gamePhase === "dealer-turn" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white dark:text-gray-200 text-xl"
                >
                  🤖 Turno del Dealer...
                </motion.div>
              )}

              {gamePhase === "game-over" && (
                <div className="space-y-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-bold text-white dark:text-gray-200"
                  >
                    {gameResult}
                  </motion.div>
                  <Button
                    onClick={() => setGameState("menu")}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                  >
                    🔄 Volver al Menú
                  </Button>
                </div>
              )}
            </div>
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
