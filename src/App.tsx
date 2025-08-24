import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'
import { GraduationCap, Plus } from 'lucide-react'
import { DateNavigation } from '@/components/DateNavigation'
import { SummaryCards } from '@/components/SummaryCards'
import { CourseCard } from '@/components/CourseCard'
import { CourseDialog } from '@/components/CourseDialog'
import { AttendanceChart } from '@/components/AttendanceChart'
import { NotificationHandler } from '@/components/NotificationHandler'
import { useAttendanceStore } from '@/store/attendanceStore'
import { Button } from '@/components/ui/button'
import logo from './assets/calendar.png';


const  App=()=> {
  const { courses, setSelectedDate } = useAttendanceStore()

  useEffect(() => {
    // Set initial date to today
    setSelectedDate(new Date())
  }, [setSelectedDate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.05),transparent_50%)] pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="">
              {/* <GraduationCap className="h-8 w-8 text-emerald-400" /> */}
              <img src={logo} alt="logo" className="h-9 md:h-[3.4rem] w-9 md:w-[3.4rem]"  />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              AttendanceTracker
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            Stay on track with your attendance goals
          </p>
        </motion.header>

        {/* Date Navigation */}
        <DateNavigation />

        {/* Summary Cards */}
        <SummaryCards />

        {/* Courses Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Your Courses</h2>
            <CourseDialog />
          </div>

          <AnimatePresence mode="wait">
            {courses.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-16"
              >
                <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-8 max-w-md mx-auto">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <GraduationCap className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No Courses Yet
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Add your first course to start tracking attendance and reach your academic goals.
                    </p>
                  </div>
                  
                  <CourseDialog
                    trigger={
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Course
                      </Button>
                    }
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="courses-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {courses.map((course, index) => (
                  <CourseCard key={course.id} course={course} index={index} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Charts Section */}
        {courses.length > 0 && <AttendanceChart />}

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16 pb-8"
        >
          <p className="text-slate-500 text-sm">
            Built for students who care about their attendance😣 <br />
            and want to avoid fines!
          </p>
        </motion.footer>
      </div>

      {/* Notification Handler */}
      <NotificationHandler />

      {/* Toast Notifications */}
      <Toaster 
        theme="dark"
        position="top-center"
        toastOptions={{
          style: {
            background: '#1E293B',
            border: '1px solid #334155',
            color: '#F1F5F9',
          },
        }}
      />
    </div>
  )
}

export default App