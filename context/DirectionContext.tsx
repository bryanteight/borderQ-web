'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Direction = "SOUTHBOUND" | "NORTHBOUND";

interface DirectionContextType {
    direction: Direction;
    toggleDirection: () => void;
    setDirection: (dir: Direction) => void;
    isFlipping: boolean;
}

const DirectionContext = createContext<DirectionContextType | undefined>(undefined);

export function DirectionProvider({ children }: { children: ReactNode }) {
    const [direction, setDirection] = useState<Direction>("SOUTHBOUND");
    const [isFlipping, setIsFlipping] = useState(false);

    const toggleDirection = () => {
        if (isFlipping) return;

        setIsFlipping(true);
        setTimeout(() => {
            setDirection(prev => prev === "SOUTHBOUND" ? "NORTHBOUND" : "SOUTHBOUND");
            setIsFlipping(false);
        }, 150); // Mid-point of animation
    };

    return (
        <DirectionContext.Provider value={{ direction, toggleDirection, setDirection, isFlipping }}>
            {children}
        </DirectionContext.Provider>
    );
}

export function useDirection() {
    const context = useContext(DirectionContext);
    if (context === undefined) {
        throw new Error('useDirection must be used within a DirectionProvider');
    }
    return context;
}
