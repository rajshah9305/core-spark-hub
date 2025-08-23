import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Code, 
  Play, 
  Square, 
  Copy, 
  Download,
  Terminal,
  FileCode,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExecutionResult {
  output: string;
  error?: string;
  timestamp: Date;
  language: string;
  executionTime: number;
}

interface CodeExecutorProps {
  className?: string;
}

export const CodeExecutor: React.FC<CodeExecutorProps> = ({ className }) => {
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionHistory, setExecutionHistory] = useState<ExecutionResult[]>([]);

  const languages = [
    { value: 'javascript', label: 'JavaScript', example: 'console.log("Hello, CoreSpark!");' },
    { value: 'python', label: 'Python', example: 'print("Hello, CoreSpark!")' },
    { value: 'typescript', label: 'TypeScript', example: 'const message: string = "Hello, CoreSpark!";\nconsole.log(message);' },
    { value: 'html', label: 'HTML', example: '<div>Hello, CoreSpark!</div>' },
    { value: 'css', label: 'CSS', example: '.hello { color: #00ff00; }' },
  ];

  const handleExecute = async () => {
    if (!code.trim() || isExecuting) return;

    setIsExecuting(true);
    const startTime = Date.now();

    try {
      // Simulate code execution (in production, this would use a secure sandbox)
      const result = await simulateCodeExecution(code, selectedLanguage);
      const executionTime = Date.now() - startTime;

      const newResult: ExecutionResult = {
        output: result.output,
        error: result.error,
        timestamp: new Date(),
        language: selectedLanguage,
        executionTime,
      };

      setExecutionHistory(prev => [newResult, ...prev.slice(0, 9)]); // Keep last 10 results
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const newResult: ExecutionResult = {
        output: '',
        error: error instanceof Error ? error.message : 'Unknown execution error',
        timestamp: new Date(),
        language: selectedLanguage,
        executionTime,
      };

      setExecutionHistory(prev => [newResult, ...prev.slice(0, 9)]);
    } finally {
      setIsExecuting(false);
    }
  };

  const loadExample = () => {
    const language = languages.find(l => l.value === selectedLanguage);
    if (language) {
      setCode(language.example);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleCopyOutput = (output: string) => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center glow-secondary">
              <Code className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <CardTitle className="gradient-text-primary">Code Executor</CardTitle>
              <p className="text-sm text-muted-foreground">
                Write and execute code in a secure sandbox environment
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Language Selection */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-effect">
                  {languages.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={loadExample}>
              Load Example
            </Button>
          </div>

          {/* Code Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Code</label>
              <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </div>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`Write your ${selectedLanguage} code here...`}
              className="min-h-[300px] font-mono text-sm bg-background/50 border-border/50 focus:border-secondary/50"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            />
          </div>

          {/* Execute Button */}
          <Button 
            onClick={handleExecute}
            disabled={!code.trim() || isExecuting}
            className="w-full glow-secondary"
            size="lg"
          >
            {isExecuting ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                Executing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Execute Code
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Execution Results */}
      {executionHistory.length > 0 && (
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-secondary" />
              Execution Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {executionHistory.map((result, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {result.language}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          result.error ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
                        )}
                      >
                        {result.error ? (
                          <>
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Error
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Success
                          </>
                        )}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {result.executionTime}ms
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyOutput(result.output || result.error || '')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-background/30 rounded-lg p-4 border border-border/50">
                    <pre className="text-sm font-mono whitespace-pre-wrap text-foreground">
                      {result.error ? (
                        <span className="text-destructive">{result.error}</span>
                      ) : (
                        result.output || 'No output'
                      )}
                    </pre>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {result.timestamp.toLocaleString()}
                  </div>

                  {index < executionHistory.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Simulate code execution (replace with actual sandbox implementation)
async function simulateCodeExecution(code: string, language: string): Promise<{ output: string; error?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        switch (language) {
          case 'javascript':
          case 'typescript':
            // Simulate JavaScript execution
            if (code.includes('console.log')) {
              const match = code.match(/console\.log\(['"`](.+)['"`]\)/);
              resolve({ output: match ? match[1] : 'Hello, CoreSpark!' });
            } else {
              resolve({ output: 'Code executed successfully' });
            }
            break;
          case 'python':
            // Simulate Python execution
            if (code.includes('print')) {
              const match = code.match(/print\(['"`](.+)['"`]\)/);
              resolve({ output: match ? match[1] : 'Hello, CoreSpark!' });
            } else {
              resolve({ output: 'Code executed successfully' });
            }
            break;
          case 'html':
            resolve({ output: 'HTML rendered successfully' });
            break;
          case 'css':
            resolve({ output: 'CSS compiled successfully' });
            break;
          default:
            resolve({ output: 'Code executed successfully' });
        }
      } catch (error) {
        resolve({ output: '', error: 'Execution error' });
      }
    }, 1500 + Math.random() * 1000); // Simulate network delay
  });
}