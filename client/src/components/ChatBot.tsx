import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// Import profile images
import cartoonShik from '@/assets/cartoon_shik.png';
import legoShik from '@/assets/lego_shik.png';
import origamiShik from '@/assets/origami_shik.png';

type Message = {
  id: string;
  content: string;
  isUser: boolean;
};

interface ChatResponse {
  response: string;
  suggestedQuestions: string[];
}

interface SuggestedQuestionsResponse {
  suggestedQuestions: string[];
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Select a random profile image on component mount
  useEffect(() => {
    const images = [cartoonShik, legoShik, origamiShik];
    const randomIndex = Math.floor(Math.random() * images.length);
    setProfileImage(images[randomIndex]);
  }, []);

  // Fetch initial suggested questions
  useEffect(() => {
    const fetchSuggestedQuestions = async () => {
      try {
        const response = await fetch('/api/chat/suggested-questions');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json() as SuggestedQuestionsResponse;
        setSuggestedQuestions(data.suggestedQuestions);
      } catch (error) {
        console.error('Failed to fetch suggested questions', error);
      }
    };

    fetchSuggestedQuestions();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.content }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json() as ChatResponse;
      
      const roiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
      };

      setMessages((prev) => [...prev, roiMessage]);
      setSuggestedQuestions(data.suggestedQuestions);
    } catch (error) {
      console.error('Failed to send message', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    } else {
      setIsMinimized(!isMinimized);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.div 
        className="fixed bottom-4 right-4 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
      >
        <Button 
          onClick={toggleChat} 
          className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center p-0 overflow-hidden bg-white hover:bg-white"
        >
          {profileImage ? (
            <Avatar className="w-full h-full">
              <AvatarImage src={profileImage} alt="Roi Shikler" />
              <AvatarFallback className="bg-primary text-white">RS</AvatarFallback>
            </Avatar>
          ) : (
            <MessageCircle className="h-6 w-6 text-primary" />
          )}
        </Button>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-4 z-50 w-80 md:w-96"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden shadow-xl border border-gray-200">
              {/* Chat Header */}
              <div className="bg-primary text-white p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {profileImage ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profileImage} alt="Roi Shikler" />
                      <AvatarFallback className="bg-white text-primary">RS</AvatarFallback>
                    </Avatar>
                  ) : (
                    <MessageCircle className="h-5 w-5" />
                  )}
                  <h3 className="font-medium">Chat with Roi</h3>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-white hover:bg-primary-foreground/20"
                    onClick={toggleChat}
                  >
                    {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-white hover:bg-primary-foreground/20"
                    onClick={closeChat}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Chat Content */}
              {!isMinimized && (
                <>
                  {/* Messages */}
                  <div className="p-3 h-80 overflow-y-auto bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        {profileImage ? (
                          <Avatar className="h-20 w-20 mb-3">
                            <AvatarImage src={profileImage} alt="Roi Shikler" />
                            <AvatarFallback className="bg-primary/10 text-primary">RS</AvatarFallback>
                          </Avatar>
                        ) : (
                          <MessageCircle className="h-10 w-10 mb-2 text-gray-400" />
                        )}
                        <p className="text-sm">Hi, I'm Roi Shikler! Ask me anything about my work, interests, or background.</p>
                        <div className="mt-4 grid gap-2 w-full">
                          {suggestedQuestions.map((question, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="text-xs py-1 h-auto border-gray-300 text-left justify-start"
                              onClick={() => handleSuggestedQuestion(question)}
                            >
                              {question}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}
                          >
                            {!message.isUser && profileImage && (
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarImage src={profileImage} alt="Roi Shikler" />
                                <AvatarFallback className="bg-primary/10 text-primary">RS</AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`max-w-[75%] p-3 rounded-lg ${
                                message.isUser
                                  ? 'bg-primary text-white rounded-tr-none'
                                  : 'bg-white border border-gray-200 rounded-tl-none'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                          </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Suggested Questions */}
                  {messages.length > 0 && (
                    <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs py-1 h-auto border-gray-300"
                            onClick={() => handleSuggestedQuestion(question)}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input Area */}
                  <div className="p-3 border-t border-gray-200 bg-white">
                    <div className="flex items-end gap-2">
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="min-h-[60px] resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                      />
                      <Button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="h-10 w-10 rounded-full p-0 flex-shrink-0"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}