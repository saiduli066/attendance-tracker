import { motion } from 'framer-motion'
import { BookOpen, TrendingUp, AlertTriangle } from 'lucide-react'
import { useAttendanceStore } from '@/store/attendanceStore'

export const SummaryCards=()=> {
  const { courses, getOverallAttendance, getCoursesBelow } = useAttendanceStore()
  
  const totalCourses = courses.length
  const overallAttendance = getOverallAttendance()
  const coursesBelow = getCoursesBelow().length

  const cards = [
    {
      title: 'Total Courses',
      value: totalCourses,
      icon: BookOpen,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Overall Attendance',
      value: `${overallAttendance.percentage}%`,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      subtitle: `${overallAttendance.attended}/${overallAttendance.total}`,
    },
    {
      title: 'Below Target',
      value: coursesBelow,
      icon: AlertTriangle,
      color: coursesBelow > 0 ? 'text-red-400' : 'text-gray-400',
      bgColor: coursesBelow > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-gray-500/10 border-gray-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${card.bgColor} backdrop-blur-sm rounded-2xl p-4 border`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">{card.title}</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-white">{card.value}</span>
                {card.subtitle && (
                  <span className="text-xs text-slate-400">{card.subtitle}</span>
                )}
              </div>
            </div>
            <card.icon className={`h-8 w-8 ${card.color}`} />
          </div>
        </motion.div>
      ))}
    </div>
  )
}