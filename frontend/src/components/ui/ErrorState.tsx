import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Execution Error',
  message,
  onRetry,
}) => {
  return (
    <div className="p-6 bg-rose-50/80 border border-rose-200 rounded-xl text-rose-900 flex flex-col sm:flex-row items-start gap-4">
      <div className="p-2.5 bg-rose-100 rounded-xl text-rose-600 shrink-0">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-rose-950">{title}</h4>
        <p className="text-xs text-rose-800 mt-1 font-mono leading-relaxed bg-rose-100/50 p-2.5 rounded-lg border border-rose-200/60 mt-2">
          {message}
        </p>
        {onRetry && (
          <div className="mt-3">
            <Button
              size="sm"
              variant="danger"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={onRetry}
            >
              Retry Operation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
