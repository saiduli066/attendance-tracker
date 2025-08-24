import { useEffect } from 'react'
import { toast } from 'sonner'
import { useAttendanceStore } from '@/store/attendanceStore'

export const NotificationHandler=()=> {
  const { courses, getAttendanceForCourse } = useAttendanceStore()

  useEffect(() => {
    // Daily reminder notification (only show once per day)
    const today = new Date().toDateString()
    const lastReminder = localStorage.getItem('lastDailyReminder')
    
    if (lastReminder !== today && courses.length > 0) {
      const timer = setTimeout(() => {
        toast.info("📚 Don't forget to log today's attendance!", {
          duration: 5000,
          action: {
            label: 'Got it',
            onClick: () => {},
          },
        })
        localStorage.setItem('lastDailyReminder', today)
      }, 3000) 

      return () => clearTimeout(timer)
    }
  }, [courses.length])

  // Monitor course attendance changes for warnings
  useEffect(() => {
    courses.forEach(course => {
      const attendance = getAttendanceForCourse(course.id)
      const warningKey = `warning-${course.id}-${attendance.total}`
      
      if (attendance.percentage < course.attendanceTarget && attendance.total > 0) {
        const lastWarning = localStorage.getItem(warningKey)
        if (!lastWarning) {
          toast.warning(`⚠️ ${course.name} is below ${course.attendanceTarget}% target`, {
            description: `Current: ${attendance.percentage}% (${attendance.attended}/${attendance.total})`,
            duration: 6000,
          })
          localStorage.setItem(warningKey, 'shown')
        }
      }
    })
  }, [courses, getAttendanceForCourse])

  return null
}