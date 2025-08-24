import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAttendanceStore, type Course } from '@/store/attendanceStore'
import { Edit3, Plus } from 'lucide-react'

interface CourseDialogProps {
  course?: Course
  trigger?: React.ReactNode
}

export const CourseDialog =({ course, trigger }: CourseDialogProps)=> {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [attendanceTarget, setAttendanceTarget] = useState(75)
  
  const { addCourse, updateCourse } = useAttendanceStore()

  useEffect(() => {
    if (course) {
      setName(course.name)
      setAttendanceTarget(course.attendanceTarget)
    } else {
      setName('')
      setAttendanceTarget(75)
    }
  }, [course, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast.error('Course name is required')
      return
    }

    if (attendanceTarget < 1 || attendanceTarget > 100) {
      toast.error('Attendance target must be between 1% and 100%')
      return
    }

    if (course) {
      updateCourse(course.id, { name: name.trim(), attendanceTarget })
      toast.success('Course updated successfully!')
    } else {
      addCourse({ name: name.trim(), attendanceTarget })
      toast.success('Course added successfully!')
    }

    setOpen(false)
  }

  const defaultTrigger = (
    <Button
      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
      size="sm"
    >
      {course ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4 mr-2" />}
      {course ? null : 'Add Course'}
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {course ? 'Edit Course' : 'Add New Course'}
          </DialogTitle>
        </DialogHeader>
        
        <motion.form 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit} 
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">Course Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Mathematics, Physics"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="target" className="text-slate-300">
              Attendance Target (%)
            </Label>
            <Input
              id="target"
              type="number"
              min="1"
              max="100"
              value={attendanceTarget}
              onChange={(e) => setAttendanceTarget(Number(e.target.value))}
              className="bg-slate-800 border-slate-700 text-white focus:border-emerald-400"
            />
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {course ? 'Update' : 'Add'} Course
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}