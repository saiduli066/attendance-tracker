import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Course {
  id: string
  name: string
  attendanceTarget: number
}

export interface AttendanceRecord {
  id: string
  courseId: string
  date: string
  attended: boolean
}

interface AttendanceState {
  courses: Course[]
  attendanceRecords: AttendanceRecord[]
  selectedDate: Date
  
  // Course actions
  addCourse: (course: Omit<Course, 'id'>) => void
  updateCourse: (id: string, course: Partial<Course>) => void
  deleteCourse: (id: string) => void
  
  // Attendance actions
  markAttendance: (courseId: string, date: string, attended: boolean) => void
  getAttendanceForCourse: (courseId: string) => { attended: number; total: number; percentage: number }
  getOverallAttendance: () => { attended: number; total: number; percentage: number }
  getCoursesBelow: () => Course[]
  getProjection: (courseId: string) => string
  
  // Date actions
  setSelectedDate: (date: Date) => void
  
  // Utility
  getAttendanceForDate: (courseId: string, date: string) => AttendanceRecord | undefined
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      courses: [],
      attendanceRecords: [],
      selectedDate: new Date(),
      
      addCourse: (course) => {
        const newCourse: Course = {
          ...course,
          id: Date.now().toString(),
        }
        set((state) => ({
          courses: [...state.courses, newCourse],
        }))
      },
      
      updateCourse: (id, courseData) => {
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === id ? { ...course, ...courseData } : course
          ),
        }))
      },
      
      deleteCourse: (id) => {
        set((state) => ({
          courses: state.courses.filter((course) => course.id !== id),
          attendanceRecords: state.attendanceRecords.filter(
            (record) => record.courseId !== id
          ),
        }))
      },
      
      markAttendance: (courseId, date, attended) => {
        const existingRecord = get().attendanceRecords.find(
          (record) => record.courseId === courseId && record.date === date
        )
        
        if (existingRecord) {
          set((state) => ({
            attendanceRecords: state.attendanceRecords.map((record) =>
              record.id === existingRecord.id
                ? { ...record, attended }
                : record
            ),
          }))
        } else {
          const newRecord: AttendanceRecord = {
            id: Date.now().toString(),
            courseId,
            date,
            attended,
          }
          set((state) => ({
            attendanceRecords: [...state.attendanceRecords, newRecord],
          }))
        }
      },
      
      getAttendanceForCourse: (courseId) => {
        const records = get().attendanceRecords.filter(
          (record) => record.courseId === courseId
        )
        const attended = records.filter((record) => record.attended).length
        const total = records.length
        const percentage = total > 0 ? Math.round((attended / total) * 100) : 0
        
        return { attended, total, percentage }
      },
      
      getOverallAttendance: () => {
        const records = get().attendanceRecords
        const attended = records.filter((record) => record.attended).length
        const total = records.length
        const percentage = total > 0 ? Math.round((attended / total) * 100) : 0
        
        return { attended, total, percentage }
      },
      
      getCoursesBelow: () => {
        const { courses, getAttendanceForCourse } = get()
        return courses.filter((course) => {
          const attendance = getAttendanceForCourse(course.id)
          return attendance.percentage < course.attendanceTarget
        })
      },
      
      getProjection: (courseId) => {
        const course = get().courses.find((c) => c.id === courseId)
        if (!course) return ''
        
        const attendance = get().getAttendanceForCourse(courseId)
        const currentPercentage = attendance.percentage
        const target = course.attendanceTarget
        
        if (currentPercentage >= target) {
          return `✅ Target achieved!`
        }
        
        const { attended, total } = attendance
        
        // Calculate classes needed to reach target
        let classesNeeded = 0
        let futureAttended = attended
        let futureTotal = total
        
        while ((futureAttended / futureTotal) * 100 < target && classesNeeded < 100) {
          futureAttended++
          futureTotal++
          classesNeeded++
        }
        
        return `📈 Attend ${classesNeeded} more classes to reach ${target}%`
      },
      
      setSelectedDate: (date) => {
        set({ selectedDate: date })
      },
      
      getAttendanceForDate: (courseId, date) => {
        return get().attendanceRecords.find(
          (record) => record.courseId === courseId && record.date === date
        )
      },
    }),
    {
      name: 'attendance-storage',
      partialize: (state) => ({
        courses: state.courses,
        attendanceRecords: state.attendanceRecords,
      }),
    }
  )
)