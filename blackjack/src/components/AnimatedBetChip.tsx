"use client"
import { motion, AnimatePresence } from "framer-motion"

interface Props {
  visible: boolean
  won: boolean
  keyId?: string
}

export default function AnimatedBetChip({ visible, won, keyId }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={keyId}
          initial={{ x: 0, y: 300, scale: 1 }}
          animate={{
            x: 0,
            y: 0,
            scale: 1.2,
            transition: { duration: 0.5, ease: "easeOut" },
          }}
          exit={{
            x: won ? 0 : 0,
            y: won ? 300 : -200,
            opacity: 0,
            scale: 0.8,
            transition: { duration: 0.6, ease: "easeInOut" },
          }}
          className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-yellow-400 border-4 border-yellow-600 shadow-lg flex items-center justify-center text-lg font-bold text-black"
        >
          💰
        </motion.div>
      )}
    </AnimatePresence>
  )
}
