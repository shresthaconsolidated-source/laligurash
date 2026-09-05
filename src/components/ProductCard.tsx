import React from 'react';
import { ArrowUpRight, Flame } from 'lucide-react';
import TiltedCard from './bits/TiltedCard';
import { Product, npr } from '../data/products';
import { useShopModal } from '../context/ShopModalContext';

export default function ProductCard({ product, tilt = true }: { product: Product; tilt?: boolean }) {
  const { openShop } = useShopModal();
  const inner = (
    <article className="card overflow-hidden bg-wax-2 h-full flex flex-col group">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      </div>
      <div className="p-5 md:p-6 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl md:text-2xl leading-tight">{product.name}</h3>
          <span className="shrink-0 inline-flex items-center gap-1 text-xs text-mute pt-1">
            <Flame size={13} strokeWidth={1.75} /> {product.burn}
          </span>
        </div>
        <p className="text-sm text-mute leading-relaxed">{product.tagline}</p>
        <div className="mt-auto pt-3 flex items-end justify-between gap-4 border-t border-ink/10">
          <div>
            {product.price ? (
              <>
                <span className="block text-[11px] uppercase tracking-wider text-mute">from</span>
                <span className="font-display text-2xl">{npr(product.price)}</span>
              </>
            ) : (
              <span className="font-display text-xl text-mute">Price on request</span>
            )}
          </div>
          <button
            onClick={() => openShop(product.name)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta-deep hover:text-terracotta transition-colors"
          >
            Request a quote <ArrowUpRight size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </article>
  );
  return tilt ? <TiltedCard amplitude={6} scale={1.02} className="h-full">{inner}</TiltedCard> : inner;
}
