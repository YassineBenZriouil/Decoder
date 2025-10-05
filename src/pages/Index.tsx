import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import CipherButton from "@/components/CipherButton";
import { encode, decode, cipherDescriptions, CipherType } from "@/utils/ciphers";
import { toast } from "sonner";

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [selectedCipher, setSelectedCipher] = useState<CipherType>("shifter");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);

  const ciphers: CipherType[] = ["shifter", "caesar", "reverse", "rot13", "atbash"];

  const handleProcess = (text: string, cipher: CipherType, processMode: "encode" | "decode") => {
    const result = processMode === "encode" ? encode(text, cipher) : decode(text, cipher);
    setOutputText(result);
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    handleProcess(value, selectedCipher, mode);
  };

  const handleCipherChange = (cipher: CipherType) => {
    setSelectedCipher(cipher);
    handleProcess(inputText, cipher, mode);
  };

  const handleModeChange = (newMode: "encode" | "decode") => {
    setMode(newMode);
    handleProcess(inputText, selectedCipher, newMode);
  };

  const handleCopy = async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-2xl font-mono font-medium text-foreground">decoder</h1>
          <p className="text-sm font-mono text-muted-foreground">minimal text cipher tool</p>
        </header>

        <div className="space-y-4">
          <div className="flex gap-2 justify-center">
            <Button
              variant={mode === "encode" ? "default" : "outline"}
              onClick={() => handleModeChange("encode")}
              className="font-mono text-xs"
            >
              encode
            </Button>
            <Button
              variant={mode === "decode" ? "default" : "outline"}
              onClick={() => handleModeChange("decode")}
              className="font-mono text-xs"
            >
              decode
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {ciphers.map((cipher) => (
              <CipherButton
                key={cipher}
                name={cipher}
                description={cipherDescriptions[cipher]}
                isActive={selectedCipher === cipher}
                onClick={() => handleCipherChange(cipher)}
              />
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground">input</label>
            <Textarea
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="enter text here..."
              className="min-h-[200px] font-mono text-sm resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-muted-foreground">output</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!outputText}
                className="h-6 px-2 font-mono text-xs"
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <Textarea
              value={outputText}
              readOnly
              placeholder="output will appear here..."
              className="min-h-[200px] font-mono text-sm resize-none bg-muted"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;
