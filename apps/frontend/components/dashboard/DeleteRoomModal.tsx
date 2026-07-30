"use client";
import React from "react";
import CustomModal from "../ui/CustomModal";
import { DestructiveButton } from "../ui/DestructiveButton";

interface DeleteRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  roomname: string;
}

export default function DeleteRoomModal({
  isOpen,
  onClose,
  onConfirm,
  roomname,
}: DeleteRoomModalProps) {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Delete Room">
      <div className="space-y-4">
        <p className="text-sm text-white/70 leading-relaxed">
          Are you sure you want to delete <span className="text-white font-semibold">"{roomname}"</span>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200 active:scale-[0.98]"
          >
            Cancel
          </button>
          <DestructiveButton
            type="button"
            onClick={onConfirm}
          >
            Delete Room
          </DestructiveButton>
        </div>
      </div>
    </CustomModal>
  );
}
