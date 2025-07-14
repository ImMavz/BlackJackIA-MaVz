"use client"
import { motion } from "framer-motion"

interface FichasApuestaProps {
  balance: number
  bet: number
  onApostar: (valor: number) => void
  disabled?: boolean
}

const valoresFichas = [10, 50, 100, 500]

const getChipColor = (valor: number) => {
  switch (valor) {
    case 10:
      return "bg-red-500 border-red-700"
    case 50:
      return "bg-blue-500 border-blue-700"
    case 100:
      return "bg-green-500 border-green-700"
    case 500:
      return "bg-purple-500 border-purple-700"
    default:
      return "bg-gray-500 border-gray-700"
  }
}

export default function FichasApuesta({ balance, bet, onApostar, disabled }: FichasApuestaProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center space-y-2">
        <p className="text-gray-800 dark:text-white text-xl font-semibold">
          💰 Tu saldo: <span className="text-green-600 dark:text-green-400">${balance}</span>
        </p>
        <p className="text-gray-800 dark:text-white text-lg">
          🎲 Apuesta actual: <span className="text-blue-600 dark:text-blue-400">${bet}</span>
        </p>
      </div>

      <div className="flex gap-4">
        {valoresFichas.map((valor) => (
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            key={valor}
            onClick={() => onApostar(valor)}
            disabled={disabled || balance < valor}
            className={`w-14 h-14 rounded-full font-bold text-sm shadow-lg border-2 transition-all duration-200 text-white
              ${
                balance >= valor
                  ? `${getChipColor(valor)} hover:scale-110 cursor-pointer`
                  : "bg-gray-400 border-gray-500 text-gray-200 cursor-not-allowed opacity-50"
              }
            `}
          >
            ${valor}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
