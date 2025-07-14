"use client"
import { motion, AnimatePresence } from "framer-motion"

interface Props {
  visible: boolean
  won: boolean
  keyId?: string
  amount: number
}

export default function AnimatedBetChip({ visible, won, keyId, amount }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={keyId}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" },
          }}
          exit={{
            x: won ? 0 : 0,
            y: won ? 200 : -150,
            opacity: 0,
            scale: won ? 1.2 : 0.6,
            transition: { duration: 0.8, ease: "easeInOut" },
          }}
          className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">
            {/* Ficha principal */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-4 border-yellow-700 shadow-xl flex items-center justify-center">
              <span className="text-sm font-bold text-black">${amount}</span>
            </div>
            {/* Efecto de brillo */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
