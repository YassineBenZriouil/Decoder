import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CipherButtonProps {
  name: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}

const CipherButton = ({ name, description, isActive, onClick }: CipherButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "default" : "outline"}
            onClick={onClick}
            className="font-mono text-xs"
          >
            {name}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="font-mono text-xs max-w-xs">
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CipherButton;
