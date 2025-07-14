// src/components/FichasApuesta.tsx
"use client"
import { motion } from "framer-motion"

interface FichasApuestaProps {
  balance: number
  bet: number
  onApostar: (valor: number) => void
  disabled?: boolean
}

const valoresFichas = [10, 50, 100, 500]

export default function FichasApuesta({ balance, bet, onApostar, disabled }: FichasApuestaProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <p className="text-white text-xl">💰 Tu saldo: ${balance}</p>
      <p className="text-white text-lg">🎲 Apuesta actual: ${bet}</p>

      <div className="flex gap-4">
        {valoresFichas.map((valor) => (
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            key={valor}
            onClick={() => onApostar(valor)}
            disabled={disabled || balance < valor}
            className={`w-14 h-14 rounded-full font-bold text-lg shadow-md border-2 transition-all duration-200
              ${balance >= valor ? "bg-red-500 text-white hover:scale-110" : "bg-gray-500 text-gray-200 cursor-not-allowed"}
            `}
          >
            ${valor}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
