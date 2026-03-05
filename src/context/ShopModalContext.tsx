import React, { createContext, useContext, useState } from 'react';

interface ShopModalContextType {
    openShop: (product?: string) => void;
}

export const ShopModalContext = createContext<ShopModalContextType>({ openShop: () => { } });

export function useShopModal() {
    return useContext(ShopModalContext);
}

export function ShopModalProvider({ children, onOpen }: { children: React.ReactNode; onOpen: (product: string) => void }) {
    const openShop = (product = '') => onOpen(product);
    return (
        <ShopModalContext.Provider value={{ openShop }}>
            {children}
        </ShopModalContext.Provider>
    );
}
