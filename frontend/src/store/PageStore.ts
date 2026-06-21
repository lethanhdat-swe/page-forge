import { create } from "zustand";

// 1. Định nghĩa các kiểu dữ liệu (Interfaces) theo Spec của dự án
export interface Block {
    id: string;
    type: string;
    settings: {
        layout: string;
        [key: string]: any;
    };
    data: {
        [key: string]: any;
    };
}

export interface StoreState {
    // Trạng thái Quản lý Thiết bị (Đa màn hình)
    currentDevice: "desktop" | "tablet" | "mobile";
    setDevice: (device: "desktop" | "tablet" | "mobile") => void;

    // Trạng thái Quản lý Lịch sử (Cỗ máy thời gian Undo/Redo)
    past: Block[][];
    present: Block[];
    future: Block[][];

    // Các hàm hành động nhào nặn Blocks (Sẽ đắp logic chi tiết ở các bước sau)
    // addBlock: (block: Block) => void;
    // removeBlock: (id: string) => void;
}

// 2. Khởi tạo Zustand Store tổng duy nhất
export const usePageStore = create<StoreState>((set) => ({
    // Dữ liệu mặc định ban đầu cho thiết bị preview
    currentDevice: "desktop",
    setDevice: (device) => set({ currentDevice: device }),

    // Khung dữ liệu lịch sử trống để chuẩn bị cho Undo/Redo
    past: [],
    present: [],
    future: [],
}));
