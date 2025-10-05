import { useState, useEffect } from "react";
import { Copy, Check, Search, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CipherButton from "@/components/CipherButton";
import ThemeToggle from "@/components/ThemeToggle";
import CreateCipherDialog from "@/components/CreateCipherDialog";
import {
  encode,
  decode,
  cipherDescriptions,
  CipherType,
  CustomCipher,
  learnCipherFromExample,
  encodeCombined,
  decodeCombined,
  saveCustomCiphers,
  loadCustomCiphers,
} from "@/utils/ciphers";
import { toast } from "sonner";

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [selectedCiphers, setSelectedCiphers] = useState<string[]>(["shifter"]);
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);
  const [customCiphers, setCustomCiphers] = useState<Record<string, CustomCipher>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isCombineMode, setIsCombineMode] = useState(false);

  const baseCiphers: CipherType[] = ["shifter", "caesar", "reverse", "rot13", "atbash", "morse"];

  useEffect(() => {
    setCustomCiphers(loadCustomCiphers());
  }, []);

  useEffect(() => {
    saveCustomCiphers(customCiphers);
  }, [customCiphers]);

  const allCiphers = [...baseCiphers, ...Object.keys(customCiphers)];

  const filteredCiphers = searchQuery
    ? allCiphers.filter((cipher) => {
        const description =
          cipherDescriptions[cipher] || customCiphers[cipher]?.description || "";
        return (
          cipher.toLowerCase().includes(searchQuery.toLowerCase()) ||
          description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    : allCiphers;

  const handleProcess = (
    text: string,
    ciphers: string[],
    processMode: "encode" | "decode"
  ) => {
    if (!text || ciphers.length === 0) {
      setOutputText("");
      return;
    }

    let result: string;
    
    if (isCombineMode && ciphers.length > 1) {
      const cipherConfigs = ciphers.map((c) => ({
        type: c as CipherType,
        custom: customCiphers[c],
      }));
      result =
        processMode === "encode"
          ? encodeCombined(text, cipherConfigs)
          : decodeCombined(text, cipherConfigs);
    } else {
      const cipher = ciphers[0];
      const custom = customCiphers[cipher];
      result =
        processMode === "encode"
          ? encode(text, cipher, custom)
          : decode(text, cipher, custom);
    }
    
    setOutputText(result);
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    handleProcess(value, selectedCiphers, mode);
  };

  const handleCipherToggle = (cipher: string) => {
    let newCiphers: string[];
    
    if (isCombineMode) {
      if (selectedCiphers.includes(cipher)) {
        newCiphers = selectedCiphers.filter((c) => c !== cipher);
      } else {
        newCiphers = [...selectedCiphers, cipher];
      }
    } else {
      newCiphers = [cipher];
    }
    
    if (newCiphers.length === 0) {
      newCiphers = [cipher];
    }
    
    setSelectedCiphers(newCiphers);
    handleProcess(inputText, newCiphers, mode);
  };

  const handleModeChange = (newMode: "encode" | "decode") => {
    setMode(newMode);
    handleProcess(inputText, selectedCiphers, newMode);
  };

  const handleCopy = async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateCipher = (
    name: string,
    example1: string,
    example2: string
  ) => {
    const learned = learnCipherFromExample(example1, example2);
    if (!learned) {
      toast.error("Could not learn pattern from examples");
      return;
    }

    setCustomCiphers({
      ...customCiphers,
      [name]: {
        ...learned,
        name,
        description: `Custom cipher: ${example1} → ${example2}`,
      },
    });
    toast.success(`Cipher "${name}" created`);
  };

  const toggleCombineMode = () => {
    const newMode = !isCombineMode;
    setIsCombineMode(newMode);
    if (!newMode && selectedCiphers.length > 1) {
      setSelectedCiphers([selectedCiphers[0]]);
      handleProcess(inputText, [selectedCiphers[0]], mode);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center space-y-2">
          <div className="flex items-center justify-center gap-4">
            <h1 className="text-2xl font-mono font-medium text-foreground">
              decoder
            </h1>
            <ThemeToggle />
          </div>
          <p className="text-sm font-mono text-muted-foreground">
            minimal text cipher tool
          </p>
        </header>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 justify-center items-center">
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
            <Button
              variant={isCombineMode ? "default" : "outline"}
              onClick={toggleCombineMode}
              size="sm"
              className="font-mono text-xs"
            >
              <Layers className="h-3 w-3" />
              combine
            </Button>
            <CreateCipherDialog onCreateCipher={handleCreateCipher} />
          </div>

          {isCombineMode && selectedCiphers.length > 1 && (
            <div className="flex flex-wrap gap-1 justify-center items-center animate-fade-in">
              <span className="text-xs font-mono text-muted-foreground">
                chain:
              </span>
              {selectedCiphers.map((cipher, index) => (
                <Badge key={index} variant="secondary" className="font-mono text-xs">
                  {cipher}
                </Badge>
              ))}
            </div>
          )}

          {allCiphers.length > 5 && (
            <div className="flex justify-center">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="search ciphers..."
                  className="pl-9 font-mono text-xs h-8"
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 justify-center">
            {filteredCiphers.map((cipher) => (
              <CipherButton
                key={cipher}
                name={cipher}
                description={
                  cipherDescriptions[cipher] ||
                  customCiphers[cipher]?.description ||
                  "Custom cipher"
                }
                isActive={selectedCiphers.includes(cipher)}
                onClick={() => handleCipherToggle(cipher)}
              />
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground">
              input
            </label>
            <Textarea
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="enter text here..."
              className="min-h-[200px] font-mono text-sm resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-muted-foreground">
                output
              </label>
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
              key={outputText}
              value={outputText}
              readOnly
              placeholder="output will appear here..."
              className="min-h-[200px] font-mono text-sm resize-none bg-muted animate-slide-in"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;
