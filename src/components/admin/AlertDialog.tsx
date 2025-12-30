"use client";

import { X, CheckCircle, Info, AlertCircle, AlertTriangle } from "lucide-react";

type AlertDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  variant?: "success" | "info" | "warning" | "error";
};

export default function AlertDialog({
  open,
  onClose,
  title,
  message,
  buttonText = "OK",
  variant = "info",
}: AlertDialogProps) {
  if (!open) return null;

  const variantStyles = {
    success: {
      icon: CheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      buttonBg: "bg-green-600 hover:bg-green-700",
    },
    info: {
      icon: Info,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
    },
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      buttonBg: "bg-yellow-600 hover:bg-yellow-700",
    },
    error: {
      icon: AlertCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      buttonBg: "bg-red-600 hover:bg-red-700",
    },
  };

  const style = variantStyles[variant];
  const Icon = style.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 ${style.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${style.iconColor}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">{message}</p>
          </div>
          <div className="flex items-center justify-end">
            <button
              onClick={onClose}
              className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${style.buttonBg}`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

