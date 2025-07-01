import React from "react";
import ReactDOM from "react-dom";
import { TelegramUser } from "~/contexts/TelegramAuthContext";

interface ProfilePopupProps {
  user: TelegramUser;
  onClose: () => void;
  onLogout: () => void;
}

export const ProfilePopup: React.FC<ProfilePopupProps> = ({
  user,
  onClose,
  onLogout,
}) => {
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="bg-stone-800 text-white rounded-lg p-6 w-80 shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        {user.photo_url && (
          <img
            src={user.photo_url}
            alt="avatar"
            className="w-16 h-16 rounded-full mx-auto mb-4"
          />
        )}
        <h2 className="text-lg font-semibold text-center">
          {user.first_name} {user.last_name}
        </h2>
        {user.username && (
          <p className="text-center text-gray-300">@{user.username}</p>
        )}
        <p className="text-center text-xs text-gray-400 mt-1">
          ID: {user.id}
        </p>

        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition"
        >
          Выйти
        </button>
      </div>
    </div>,
    document.body
  );
};
