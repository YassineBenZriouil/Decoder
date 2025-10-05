import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CreateCipherDialogProps {
  onCreateCipher: (name: string, example1: string, example2: string) => void;
}

const CreateCipherDialog = ({ onCreateCipher }: CreateCipherDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [example1, setExample1] = useState("");
  const [example2, setExample2] = useState("");

  const handleCreate = () => {
    if (!name.trim() || !example1.trim() || !example2.trim()) {
      toast.error("All fields are required");
      return;
    }

    onCreateCipher(name.toLowerCase().replace(/\s+/g, '_'), example1, example2);
    setName("");
    setExample1("");
    setExample2("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="font-mono text-xs">
          <Plus className="h-3 w-3" />
          create cipher
        </Button>
      </DialogTrigger>
      <DialogContent className="font-mono">
        <DialogHeader>
          <DialogTitle className="font-mono">Create Custom Cipher</DialogTitle>
          <DialogDescription className="font-mono text-xs">
            Provide examples to teach the cipher pattern
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs">cipher name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my_cipher"
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="example1" className="text-xs">original text</Label>
            <Input
              id="example1"
              value={example1}
              onChange={(e) => setExample1(e.target.value)}
              placeholder="love"
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="example2" className="text-xs">encoded text</Label>
            <Input
              id="example2"
              value={example2}
              onChange={(e) => setExample2(e.target.value)}
              placeholder="velo"
              className="font-mono text-sm"
            />
          </div>
          <Button onClick={handleCreate} className="w-full font-mono text-xs">
            create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCipherDialog;
