"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Heart,
  Activity,
  Brain,
  Calendar,
  FileText,
  Bell,
  LogOut,
  Zap,
  TrendingUp,
  Shield,
  Video,
  Pill,
  Clock,
  AlertTriangle,
  Smile,
  Meh,
  Frown,
  Coins,
  Users,
  Camera,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Target,
  Award,
  Headphones,
  Eye,
  Gamepad2,
  Square,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import {
  type MoodEntry,
  type Appointment,
  type AIAlert,
  saveMoodEntry,
  getMoodEntries,
  saveAppointment,
  getAppointments,
  addHealthTokens,
  getHealthTokens,
  getAIAlerts,
  dismissAIAlert,
  generateUniqueId,
  generateAppointmentCode,
  analyzeMoodTrend,
  generateTherapySuggestions,
  predictMoodForecast,
} from "@/lib/data-store"

export function PatientDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()

  // State management
  const [activeTab, setActiveTab] = useState("overview")
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [aiAlerts, setAiAlerts] = useState<AIAlert[]>([])
  const [healthTokens, setHealthTokens] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingData, setRecordingData] = useState<any[]>([])
  const [showInsightsDialog, setShowInsightsDialog] = useState(false)
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false)
  const [showVRDialog, setShowVRDialog] = useState(false)
  const [vrSessionActive, setVrSessionActive] = useState(false)
  const [vrSessionTime, setVrSessionTime] = useState(0)
  const [demoMode, setDemoMode] = useState(false)
  const [currentMood, setCurrentMood] = useState<number>(5)
  const [moodNote, setMoodNote] = useState("")
  const [aiInsights, setAiInsights] = useState<any[]>([])
  const [healthMetrics, setHealthMetrics] = useState({
    heartRate: 72,
    bloodPressure: "120/80",
    temperature: 98.6,
    oxygenSat: 98,
    steps: 8432,
    sleep: 7.5,
  })

  // Load data on component mount
  useEffect(() => {
    loadUserData()
    if (demoMode) {
      startLiveDemo()
    }
  }, [demoMode])

  // VR session timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (vrSessionActive) {
      interval = setInterval(() => {
        setVrSessionTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [vrSessionActive])

  const loadUserData = () => {
    const moods = getMoodEntries(user?.id || "")
    const appts = getAppointments(user?.id || "")
    const alerts = getAIAlerts(user?.id || "")
    const tokens = getHealthTokens(user?.id || "")

    setMoodEntries(moods)
    setAppointments(appts)
    setAiAlerts(alerts)
    setHealthTokens(tokens)

    // Generate AI insights based on mood data
    if (moods.length > 0) {
      generateAIInsights(moods)
    }
  }

  const generateAIInsights = (moods: MoodEntry[]) => {
    const trend = analyzeMoodTrend(moods)
    const suggestions = generateTherapySuggestions(moods)
    const forecast = predictMoodForecast(moods)

    const insights = [
      {
        id: generateUniqueId(),
        type: "trend",
        title: "Mood Trend Analysis",
        content: `Your mood has been ${trend.direction} over the past week with an average of ${trend.average.toFixed(1)}/10.`,
        severity:
          trend.direction === "improving" ? "positive" : trend.direction === "declining" ? "warning" : "neutral",
        timestamp: new Date().toISOString(),
      },
      {
        id: generateUniqueId(),
        type: "prediction",
        title: "AI Mood Forecast",
        content: `Based on your patterns, your mood is predicted to be ${forecast.prediction} tomorrow with ${forecast.confidence}% confidence.`,
        severity: "info",
        timestamp: new Date().toISOString(),
      },
      {
        id: generateUniqueId(),
        type: "recommendation",
        title: "Personalized Therapy Suggestions",
        content: suggestions.join(", "),
        severity: "positive",
        timestamp: new Date().toISOString(),
      },
    ]

    setAiInsights(insights)
  }

  const startLiveDemo = () => {
    const interval = setInterval(() => {
      setHealthMetrics((prev) => ({
        ...prev,
        heartRate: Math.floor(Math.random() * 20) + 65,
        temperature: Math.round((Math.random() * 2 + 97.5) * 10) / 10,
        oxygenSat: Math.floor(Math.random() * 3) + 97,
        steps: prev.steps + Math.floor(Math.random() * 10),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }

  const handleMoodSubmit = () => {
    const entry: MoodEntry = {
      id: generateUniqueId(),
      userId: user?.id || "",
      mood: currentMood,
      note: moodNote,
      timestamp: new Date().toISOString(),
      aiAnalysis: `Mood level ${currentMood}/10 recorded. ${currentMood >= 7 ? "Great mood detected!" : currentMood >= 4 ? "Moderate mood, consider relaxation techniques." : "Low mood detected, consider speaking with a counselor."}`,
    }

    saveMoodEntry(entry)
    addHealthTokens(user?.id || "", 10)
    setMoodEntries((prev) => [entry, ...prev])
    setHealthTokens((prev) => prev + 10)
    setCurrentMood(5)
    setMoodNote("")

    // Generate new insights
    generateAIInsights([entry, ...moodEntries])
  }

  const scheduleAppointment = () => {
    const appointment: Appointment = {
      id: generateUniqueId(),
      userId: user?.id || "",
      doctorName: "Dr. Sarah Johnson",
      type: "General Consultation",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: "scheduled",
      appointmentCode: generateAppointmentCode(),
      isVR: false,
    }

    saveAppointment(appointment)
    addHealthTokens(user?.id || "", 25)
    setAppointments((prev) => [appointment, ...prev])
    setHealthTokens((prev) => prev + 25)
    setShowAppointmentDialog(false)
  }

  const startVRSession = () => {
    setVrSessionActive(true)
    setVrSessionTime(0)
    setShowVRDialog(true)
    addHealthTokens(user?.id || "", 50)
    setHealthTokens((prev) => prev + 50)
  }

  const endVRSession = () => {
    setVrSessionActive(false)
    setShowVRDialog(false)

    // Save VR session as appointment
    const vrAppointment: Appointment = {
      id: generateUniqueId(),
      userId: user?.id || "",
      doctorName: "VR Therapy Session",
      type: "VR Meditation",
      date: new Date().toISOString(),
      status: "completed",
      appointmentCode: generateAppointmentCode(),
      isVR: true,
      duration: vrSessionTime,
    }

    saveAppointment(vrAppointment)
    setAppointments((prev) => [vrAppointment, ...prev])
  }

  const startRecording = () => {
    setIsRecording(true)
    const recordingInterval = setInterval(() => {
      const dataPoint = {
        timestamp: new Date().toISOString(),
        heartRate: healthMetrics.heartRate,
        mood: currentMood,
        activity: "consultation",
      }
      setRecordingData((prev) => [...prev, dataPoint])
    }, 1000)

    setTimeout(() => {
      setIsRecording(false)
      clearInterval(recordingInterval)
    }, 30000) // Stop after 30 seconds for demo
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getMoodIcon = (mood: number) => {
    if (mood >= 7) return <Smile className="h-4 w-4 text-green-500" />
    if (mood >= 4) return <Meh className="h-4 w-4 text-yellow-500" />
    return <Frown className="h-4 w-4 text-red-500" />
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "positive":
        return "text-green-600 bg-green-50"
      case "warning":
        return "text-orange-600 bg-orange-50"
      case "info":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  MedBlockCare X+
                </h1>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Patient Portal
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-1 rounded-full border border-yellow-200">
                <Coins className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700">{healthTokens} Tokens</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setDemoMode(!demoMode)}
                className={demoMode ? "bg-green-50 text-green-700 border-green-200" : ""}
              >
                {demoMode ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                {demoMode ? "Stop Demo" : "Live Demo"}
              </Button>

              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
                {aiAlerts.length > 0 && (
                  <Badge className="ml-1 h-5 w-5 p-0 text-xs bg-red-500">{aiAlerts.length}</Badge>
                )}
              </Button>

              <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-gray-200 shadow-sm">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="mood" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>Mood Tracking</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Health Records</span>
            </TabsTrigger>
            <TabsTrigger value="ai-insights" className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>AI Insights</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Welcome Card */}
            <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
                    <p className="text-blue-100">Your health journey continues with AI-powered insights</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-100">Blockchain ID</div>
                    <div className="font-mono text-sm">{user?.blockchainId}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Alerts */}
            {aiAlerts.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-orange-800">
                    <AlertTriangle className="h-5 w-5" />
                    <span>AI Health Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {aiAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200"
                    >
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="font-medium text-gray-900">{alert.title}</p>
                          <p className="text-sm text-gray-600">{alert.message}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          dismissAIAlert(alert.id)
                          setAiAlerts((prev) => prev.filter((a) => a.id !== alert.id))
                        }}
                      >
                        Dismiss
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Health Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Heart Rate</p>
                      <p className="text-3xl font-bold text-red-700">{healthMetrics.heartRate}</p>
                      <p className="text-sm text-red-500">BPM</p>
                    </div>
                    <Heart className="h-12 w-12 text-red-500" />
                  </div>
                  {demoMode && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-red-600">Live monitoring</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Blood Pressure</p>
                      <p className="text-3xl font-bold text-blue-700">{healthMetrics.bloodPressure}</p>
                      <p className="text-sm text-blue-500">mmHg</p>
                    </div>
                    <Activity className="h-12 w-12 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Oxygen Saturation</p>
                      <p className="text-3xl font-bold text-green-700">{healthMetrics.oxygenSat}%</p>
                      <p className="text-sm text-green-500">SpO2</p>
                    </div>
                    <Zap className="h-12 w-12 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Temperature</p>
                      <p className="text-3xl font-bold text-purple-700">{healthMetrics.temperature}°F</p>
                      <p className="text-sm text-purple-500">Body Temp</p>
                    </div>
                    <TrendingUp className="h-12 w-12 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Daily Steps</p>
                      <p className="text-3xl font-bold text-yellow-700">{healthMetrics.steps.toLocaleString()}</p>
                      <p className="text-sm text-yellow-500">Steps</p>
                    </div>
                    <Target className="h-12 w-12 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-600">Sleep Quality</p>
                      <p className="text-3xl font-bold text-indigo-700">{healthMetrics.sleep}h</p>
                      <p className="text-sm text-indigo-500">Last Night</p>
                    </div>
                    <Clock className="h-12 w-12 text-indigo-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    onClick={() => setShowAppointmentDialog(true)}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <Calendar className="h-6 w-6" />
                    <span className="text-sm">Schedule Appointment</span>
                  </Button>

                  <Button
                    onClick={startVRSession}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  >
                    <Video className="h-6 w-6" />
                    <span className="text-sm">Start VR Session</span>
                  </Button>

                  <Button
                    onClick={() => setActiveTab("mood")}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <Brain className="h-6 w-6" />
                    <span className="text-sm">Track Mood</span>
                  </Button>

                  <Button
                    onClick={startRecording}
                    disabled={isRecording}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50"
                  >
                    {isRecording ? <Square className="h-6 w-6" /> : <Camera className="h-6 w-6" />}
                    <span className="text-sm">{isRecording ? "Recording..." : "Start Recording"}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mood Tracking Tab */}
          <TabsContent value="mood" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>Mood Tracking</span>
                </CardTitle>
                <CardDescription>Track your daily mood and receive AI-powered insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="mood-slider">How are you feeling today? ({currentMood}/10)</Label>
                  <div className="px-4">
                    <input
                      id="mood-slider"
                      type="range"
                      min="1"
                      max="10"
                      value={currentMood}
                      onChange={(e) => setCurrentMood(Number.parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Very Low</span>
                      <span>Neutral</span>
                      <span>Very High</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mood-note">Add a note (optional)</Label>
                  <Textarea
                    id="mood-note"
                    placeholder="How are you feeling? What's on your mind?"
                    value={moodNote}
                    onChange={(e) => setMoodNote(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <Button onClick={handleMoodSubmit} className="w-full">
                  <Brain className="h-4 w-4 mr-2" />
                  Save Mood Entry (+10 Tokens)
                </Button>
              </CardContent>
            </Card>

            {/* Recent Mood Entries */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Mood Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {moodEntries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getMoodIcon(entry.mood)}
                        <div>
                          <p className="font-medium">Mood: {entry.mood}/10</p>
                          <p className="text-sm text-gray-600">{entry.note}</p>
                          <p className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{entry.aiAnalysis}</Badge>
                    </div>
                  ))}
                  {moodEntries.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No mood entries yet. Start tracking your mood above!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span>Appointments</span>
                  </div>
                  <Button onClick={() => setShowAppointmentDialog(true)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule New
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {appointment.isVR ? (
                            <Video className="h-5 w-5 text-purple-600" />
                          ) : (
                            <Calendar className="h-5 w-5 text-blue-600" />
                          )}
                          <div>
                            <p className="font-medium">{appointment.doctorName}</p>
                            <p className="text-sm text-gray-600">{appointment.type}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(appointment.date).toLocaleDateString()} at{" "}
                              {new Date(appointment.date).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={appointment.status === "completed" ? "default" : "outline"}>
                            {appointment.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">Code: {appointment.appointmentCode}</p>
                        </div>
                      </div>

                      {/* Quick Actions for appointments */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => setShowVRDialog(true)}>
                          <Video className="h-3 w-3 mr-1" />
                          Join VR Session
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowAppointmentDialog(true)}>
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Reschedule
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => alert("Reminder set!")}>
                          <Bell className="h-3 w-3 mr-1" />
                          Set Reminder
                        </Button>
                        <Button size="sm" variant="outline" onClick={startRecording}>
                          <Camera className="h-3 w-3 mr-1" />
                          Start Recording
                        </Button>
                      </div>
                    </div>
                  ))}
                  {appointments.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No appointments scheduled. Click "Schedule New" to book your first appointment!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Records Tab */}
          <TabsContent value="records" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span>Health Records</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="font-medium">Medical History</h3>
                          <p className="text-sm text-gray-600">Complete health records</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Pill className="h-8 w-8 text-green-600" />
                        <div>
                          <h3 className="font-medium">Prescriptions</h3>
                          <p className="text-sm text-gray-600">Current medications</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Activity className="h-8 w-8 text-purple-600" />
                        <div>
                          <h3 className="font-medium">Lab Results</h3>
                          <p className="text-sm text-gray-600">Recent test results</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-8 w-8 text-orange-600" />
                        <div>
                          <h3 className="font-medium">Insurance</h3>
                          <p className="text-sm text-gray-600">Coverage details</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recording Data Display */}
                {recordingData.length > 0 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Camera className="h-5 w-5 text-red-600" />
                        <span>Live Recording Data</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {recordingData.slice(-10).map((data, index) => (
                          <div key={index} className="text-xs font-mono bg-gray-100 p-2 rounded">
                            {new Date(data.timestamp).toLocaleTimeString()}: HR {data.heartRate}, Mood {data.mood},
                            Activity: {data.activity}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <span>AI Health Insights</span>
                  </div>
                  <Button onClick={() => setShowInsightsDialog(true)}>
                    <Brain className="h-4 w-4 mr-2" />
                    Get More Insights
                  </Button>
                </CardTitle>
                <CardDescription>
                  AI-powered analysis of your health data and personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiInsights.map((insight) => (
                    <Card key={insight.id} className={`border-l-4 ${getSeverityColor(insight.severity)}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium mb-2">{insight.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{insight.content}</p>
                            <p className="text-xs text-gray-500">{new Date(insight.timestamp).toLocaleDateString()}</p>
                          </div>
                          <Badge variant="outline" className={getSeverityColor(insight.severity)}>
                            {insight.type}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {aiInsights.length === 0 && (
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        No AI insights yet. Track your mood and health data to get personalized insights!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ML Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  <span>ML-Powered Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => alert("Emotion detection started! (Demo)")}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-blue-500 to-cyan-500"
                  >
                    <Camera className="h-6 w-6" />
                    <span className="text-sm">AI Emotion Detection</span>
                  </Button>

                  <Button
                    onClick={() => alert("Health prediction generated! (Demo)")}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-green-500 to-emerald-500"
                  >
                    <TrendingUp className="h-6 w-6" />
                    <span className="text-sm">Predictive Health AI</span>
                  </Button>

                  <Button
                    onClick={() => alert("Therapy suggestions updated! (Demo)")}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-purple-500 to-violet-500"
                  >
                    <Headphones className="h-6 w-6" />
                    <span className="text-sm">Smart Therapy AI</span>
                  </Button>

                  <Button
                    onClick={() => alert("Doctor matching complete! (Demo)")}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-orange-500 to-red-500"
                  >
                    <Users className="h-6 w-6" />
                    <span className="text-sm">AI Doctor Matching</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <Dialog open={showInsightsDialog} onOpenChange={setShowInsightsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span>Advanced AI Health Analysis</span>
            </DialogTitle>
            <DialogDescription>
              Comprehensive AI analysis of your health patterns and personalized recommendations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-medium text-blue-800 mb-2">🧠 Cognitive Health Analysis</h3>
                <p className="text-sm text-blue-700">
                  Based on your mood patterns, your cognitive health score is 8.2/10. Your stress levels have decreased
                  by 15% this week, indicating improved mental wellness.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <h3 className="font-medium text-green-800 mb-2">💚 Physical Health Insights</h3>
                <p className="text-sm text-green-700">
                  Your vital signs show excellent cardiovascular health. Heart rate variability suggests good recovery
                  patterns. Consider maintaining current activity levels.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              <CardContent className="p-4">
                <h3 className="font-medium text-orange-800 mb-2">⚡ Predictive Recommendations</h3>
                <p className="text-sm text-orange-700">
                  AI predicts optimal sleep time: 10:30 PM for maximum recovery. Recommended meditation: 15 minutes
                  daily to maintain current mood stability.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-4">
                <h3 className="font-medium text-purple-800 mb-2">🎯 Personalized Action Plan</h3>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Continue current exercise routine (3x/week)</li>
                  <li>• Increase water intake by 10% for optimal hydration</li>
                  <li>• Schedule preventive check-up in 2 weeks</li>
                  <li>• Practice breathing exercises during high-stress periods</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                addHealthTokens(user?.id || "", 50)
                setHealthTokens((prev) => prev + 50)
                setShowInsightsDialog(false)
              }}
            >
              <Award className="h-4 w-4 mr-2" />
              Save Analysis (+50 Tokens)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAppointmentDialog} onOpenChange={setShowAppointmentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>Book a consultation with our AI-powered healthcare system</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <Users className="h-6 w-6" />
                <span className="text-sm">General Consultation</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <Video className="h-6 w-6" />
                <span className="text-sm">VR Therapy Session</span>
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={scheduleAppointment}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Appointment (+25 Tokens)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showVRDialog} onOpenChange={setShowVRDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Video className="h-5 w-5 text-purple-600" />
              <span>VR Therapy Session</span>
            </DialogTitle>
            <DialogDescription>Immersive virtual reality therapy and meditation session</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {vrSessionActive ? (
              <div className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Gamepad2 className="h-16 w-16 text-white" />
                </div>
                <div>
                  <p className="text-lg font-medium">VR Session Active</p>
                  <p className="text-2xl font-bold text-purple-600">{formatTime(vrSessionTime)}</p>
                  <p className="text-sm text-gray-600">Guided meditation in progress...</p>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-purple-600">Recording biometrics</span>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <Video className="h-16 w-16 mx-auto text-purple-600" />
                <div>
                  <p className="text-lg font-medium">Ready to Start VR Session</p>
                  <p className="text-sm text-gray-600">
                    Put on your VR headset and begin your immersive therapy experience
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            {vrSessionActive ? (
              <Button onClick={endVRSession} variant="destructive">
                <Square className="h-4 w-4 mr-2" />
                End Session
              </Button>
            ) : (
              <Button onClick={() => setVrSessionActive(true)} className="bg-purple-600 hover:bg-purple-700">
                <Play className="h-4 w-4 mr-2" />
                Start VR Session
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
