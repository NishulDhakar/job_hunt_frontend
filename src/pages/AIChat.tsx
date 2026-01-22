import { useState, useRef, useEffect } from 'react'
import { api } from '@/lib/api'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Send, User } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export function AIChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hello! I'm your AI career advisor. I can help you with job recommendations, career advice, salary negotiations, resume tips, and interview preparation. What would you like to know?"
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, loading])

    const handleSend = async () => {
        if (!input.trim() || loading) return

        const userMessage = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setLoading(true)

        try {
            const response = await api.chatWithAI(userMessage)
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: response.explanation || "I'm here to help with your job search. Could you provide more details about what you're looking for?"
                }
            ])
        } catch (error) {
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: "I apologize for the interruption. Let me help you with your job search. What specific guidance are you looking for?"
                }
            ])
        } finally {
            setLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl h-[calc(100vh-12rem)]">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight mb-2 font-serif">AI Career Advisor</h1>
                <p className="text-muted-foreground">
                    Get personalized career guidance and job search strategies
                </p>
            </div>

            <Card className="h-[calc(100%-5rem)] flex flex-col shadow-lg">
                <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        AI-Powered Career Assistant
                    </CardTitle>
                </CardHeader>

                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                    }`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-primary text-primary-foreground'
                                        }`}
                                >
                                    {msg.role === 'user' ? (
                                        <User className="w-5 h-5" />
                                    ) : (
                                        <Bot className="w-5 h-5" />
                                    )}
                                </div>
                                <div
                                    className={`rounded-2xl px-5 py-3 max-w-[80%] shadow-sm ${msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted border'
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="rounded-2xl px-5 py-3 bg-muted border">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="border-t p-4 bg-muted/20">
                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Ask about jobs, salaries, career advice..."
                            disabled={loading}
                            className="flex-1"
                        />
                        <Button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className="gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Send
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                        AI-powered career guidance • Press Enter to send
                    </p>
                </div>
            </Card>
        </div>
    )
}
