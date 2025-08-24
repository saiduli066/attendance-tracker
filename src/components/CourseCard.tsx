import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Edit3, Trash2, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { CourseDialog } from './CourseDialog'
import { useAttendanceStore, type Course } from '@/store/attendanceStore'
import { cn } from '@/lib/utils'

interface CourseCardProps {
  course: Course
  index: number
}

export const CourseCard =({ course, index }: CourseCardProps) =>{
  const {
    selectedDate,
    deleteCourse,
    markAttendance,
    getAttendanceForCourse,
    getProjection,
    getAttendanceForDate,
  } = useAttendanceStore()
  
  const dateString = selectedDate.toISOString().split('T')[0]
  const attendance = getAttendanceForCourse(course.id)
  const projection = getProjection(course.id)
  const existingRecord = getAttendanceForDate(course.id, dateString)
  
  const isAboveTarget = attendance.percentage >= course.attendanceTarget
  const hasAttendanceToday = existingRecord !== undefined
  const attendedToday = existingRecord?.attended

  const handleAttendance = (attended: boolean) => {
    markAttendance(course.id, dateString, attended)
    
    const newAttendance = getAttendanceForCourse(course.id)
    
    if (attended) {
      toast.success(`✅ Marked present for ${course.name}`)
      
      // Check for milestones
      if (newAttendance.percentage >= course.attendanceTarget && !isAboveTarget) {
        toast.success(`🎉 You reached ${course.attendanceTarget}% in ${course.name}!`)
      }
    } else {
      toast.error(`❌ Marked absent for ${course.name}`)
      
      // Warning if dropped below target
      if (newAttendance.percentage < course.attendanceTarget && isAboveTarget) {
        toast.error(`⚠️ ${course.name} dropped below ${course.attendanceTarget}% target`)
      }
    }
  }

  const handleDelete = () => {
    deleteCourse(course.id)
    toast.success('Course deleted successfully')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-white text-lg mb-1">{course.name}</h3>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-slate-400">
              {attendance.attended}/{attendance.total} classes
            </span>
            <span
              className={cn(
                'font-medium',
                isAboveTarget ? 'text-emerald-400' : 'text-red-400'
              )}
            >
              {attendance.percentage}% / {course.attendanceTarget}%
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <CourseDialog
            course={course}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            }
          />
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Course</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  Are you sure you want to delete "{course.name}"? This will remove all attendance records for this course. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-slate-400">Progress</span>
          <span className="text-xs text-slate-400">Target: {course.attendanceTarget}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(attendance.percentage, 100)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
              'h-2 rounded-full transition-colors',
              isAboveTarget ? 'bg-emerald-500' : 'bg-red-500'
            )}
          />
        </div>
      </div>

      {/* Projection */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 text-sm">
          <TrendingUp className="h-4 w-4 text-slate-400" />
          <span className="text-slate-300">{projection}</span>
        </div>
      </div>

      {/* Today's Status */}
      {hasAttendanceToday && (
        <div className="mb-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700">
          <div className="flex items-center space-x-2">
            {attendedToday ? (
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            ) : (
              <XCircle className="h-4 w-4 text-red-400" />
            )}
            <span className="text-sm text-slate-300">
              {attendedToday ? 'Present today' : 'Absent today'}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          onClick={() => handleAttendance(true)}
          className={cn(
            'flex-1 rounded-xl transition-all',
            attendedToday === true
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          )}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Attended
        </Button>
        
        <Button
          onClick={() => handleAttendance(false)}
          className={cn(
            'flex-1 rounded-xl transition-all',
            attendedToday === false
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
          )}
        >
          <XCircle className="h-4 w-4 mr-2" />
          Skipped
        </Button>
      </div>
    </motion.div>
  )
}