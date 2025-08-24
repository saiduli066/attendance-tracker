import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAttendanceStore } from '@/store/attendanceStore'
import { formatDate, addDays } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export const DateNavigation =()=> {
  const { selectedDate, setSelectedDate } = useAttendanceStore()

  const goToPreviousDay = () => {
    setSelectedDate(addDays(selectedDate, -1))
  }

  const goToNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1))
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  const isToday = selectedDate.toDateString() === new Date().toDateString()

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-slate-800"
    >
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPreviousDay}
          className="rounded-full hover:bg-slate-800 text-slate-300 hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex flex-col items-center space-y-2">
          <motion.h2 
            key={selectedDate.toDateString()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-lg font-semibold text-white text-center"
          >
            {formatDate(selectedDate)}
          </motion.h2>
          
          {!isToday && (
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="text-xs text-emerald-400 border-emerald-400 hover:bg-emerald-400 hover:text-slate-900"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Today
            </Button>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextDay}
          className="rounded-full hover:bg-slate-800 text-slate-300 hover:text-white"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  )
}