// src/components/IntroSplash.tsx
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  show: boolean;
  onFinish: () => void;
};

export default function IntroSplash({ show, onFinish }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 bg-white flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          style={{ pointerEvents: "auto" }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { type: "spring", stiffness: 80, damping: 10 } }}
            exit={{ y: -40, opacity: 0, transition: { duration: 0.5 } }}
            className="text-3xl md:text-5xl font-bold text-gray-900"
          >
            Crowdworks 김근영 프로젝트
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
