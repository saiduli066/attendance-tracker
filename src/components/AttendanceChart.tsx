/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { useAttendanceStore } from '@/store/attendanceStore'

export const AttendanceChart =()=> {
  const { courses, getAttendanceForCourse } = useAttendanceStore()

  const chartData = useMemo(() => {
    return courses.map(course => {
      const attendance = getAttendanceForCourse(course.id)
      return {
        name: course.name.length > 8 ? course.name.substring(0, 8) + '...' : course.name,
        fullName: course.name,
        percentage: attendance.percentage,
        attended: attendance.attended,
        total: attendance.total,
        target: course.attendanceTarget,
      }
    })
  }, [courses, getAttendanceForCourse])

  const overallData = useMemo(() => {
    const totalAttended = chartData.reduce((sum, course) => sum + course.attended, 0)
    const totalClasses = chartData.reduce((sum, course) => sum + course.total, 0)
    const totalMissed = totalClasses - totalAttended

    return [
      { name: 'Attended', value: totalAttended, color: '#10B981' },
      { name: 'Missed', value: totalMissed, color: '#EF4444' },
    ]
  }, [chartData])

  if (courses.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 mt-6"
    >
      <h3 className="text-lg font-semibold text-white mb-6">Attendance Overview</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Pie Chart */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-slate-300">Overall Attendance</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overallData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {overallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#F1F5F9'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 text-sm">
            {overallData.map((entry) => (
              <div key={entry.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-300">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Course Comparison Bar Chart */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-slate-300">Course Comparison</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#94A3B8', fontSize: 10 }}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis 
                  tick={{ fill: '#94A3B8', fontSize: 10 }}
                  axisLine={{ stroke: '#334155' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white text-sm">
                          <p className="font-medium">{data.fullName}</p>
                          <p className="text-slate-300">
                            Attendance: {data.percentage}% ({data.attended}/{data.total})
                          </p>
                          <p className="text-slate-300">Target: {data.target}%</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar 
                  dataKey="percentage" 
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="target" 
                  fill="transparent"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  strokeDasharray="5,5"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
              <span className="text-slate-300">Attendance %</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-1 border-2 border-dashed border-amber-500" />
              <span className="text-slate-300">Target %</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}