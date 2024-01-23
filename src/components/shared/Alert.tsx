import { ShieldAlert } from "lucide-react";
import { FC } from "react";

interface AlertProps {
  message: string;
}
const Alert: FC<AlertProps> = ({ message }) => {
  return (
    <div className="w-full px-5 py-3 border-warning-500 border-1 rounded-md flex items-center gap-3 bg-warning-500/10 font-light text-sm text-wrap break-all">
      <ShieldAlert className="min-w-10" />
      {message}
    </div>
  );
};
export default Alert;
