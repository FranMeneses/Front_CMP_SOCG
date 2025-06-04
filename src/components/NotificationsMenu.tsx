'use client'

import { Button } from "./ui/button";

export function NotificationsMenu() {

    return (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white shadow-lg rounded-md overflow-hidden z-50">
            {/* TODO: Rediseñar cuando se pueda implementar correctamente */}
            <div className="max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-gray-100 hover:bg-gray-50 flex justify-between items-center">
                    <div>
                        <div className="font-medium">Notification 1</div>
                    </div>
                    <Button className="text-red-500 text-xs px-2 py-1 hover:bg-red-50 rounded">
                        Dismiss
                    </Button>
                </div>
                <div className="p-3 border-b border-gray-100 hover:bg-gray-50 flex justify-between items-center">
                    <div>
                        <div className="font-medium">Notification 2</div>
                    </div>
                    <Button className="text-red-500 text-xs px-2 py-1 hover:bg-red-50 rounded">
                        Dismiss
                    </Button>
                </div>
                <div className="p-3 border-b border-gray-100 hover:bg-gray-50 flex justify-between items-center">
                    <div>
                        <div className="font-medium">Notification 3</div>
                    </div>
                    <Button className="text-red-500 text-xs px-2 py-1 hover:bg-red-50 rounded">
                        Dismiss
                    </Button>
                </div>
            </div>
        </div>
    );
};