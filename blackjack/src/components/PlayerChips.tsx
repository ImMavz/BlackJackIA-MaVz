"use client"
import { motion } from "framer-motion"

interface PlayerChipsProps {
  balance: number
}

export default function PlayerChips({ balance }: PlayerChipsProps) {
  // Calcular cuántas fichas de cada tipo mostrar
  const getChipStacks = (amount: number) => {
    const stacks: {
        value: number; count: number // Máximo 5 fichas por stack
        color: string
    }[] = []
    let remaining = amount

    const denominations = [100, 50, 10]
    const colors = ["bg-green-500 border-green-700", "bg-blue-500 border-blue-700", "bg-red-500 border-red-700"]

    denominations.forEach((denom, index) => {
      const count = Math.floor(remaining / denom)
      if (count > 0) {
        stacks.push({
          value: denom,
          count: Math.min(count, 5), // Máximo 5 fichas por stack
          color: colors[index],
        })
        remaining -= count * denom
      }
    })

    return stacks
  }

  const chipStacks = getChipStacks(balance)

  return (
    <div className="flex items-end gap-2">
      {chipStacks.map((stack, stackIndex) => (
        <div key={stack.value} className="flex flex-col items-center">
          <div className="relative">
            {Array.from({ length: stack.count }).map((_, chipIndex) => (
              <motion.div
                key={chipIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: stackIndex * 0.1 + chipIndex * 0.05 }}
                className={`w-8 h-8 rounded-full border-2 ${stack.color} shadow-md`}
                style={{
                  position: chipIndex === 0 ? "relative" : "absolute",
                  top: chipIndex === 0 ? 0 : `-${chipIndex * 2}px`,
                  zIndex: stack.count - chipIndex,
                }}
              >
                <span className="text-xs font-bold text-white flex items-center justify-center h-full">
                  {chipIndex === stack.count - 1 ? `$${stack.value}` : ""}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
      {chipStacks.length === 0 && <div className="text-gray-500 text-sm">Sin fichas</div>}
    </div>
  )
}
