"use client";

import { useEffect, useRef, useState } from "react";
import { type Shop } from "@prisma/client";
import Image from "next/image";
import { parseAddress } from "@/utils";
import { api } from "@/trpc/react";

const ITEMS_PER_PAGE = 5;

const ShopItem = ({ shop }: { shop: Shop }) => {
  const { street, city } = parseAddress(shop.address);

  return (
    <li className="flex w-full items-center gap-4 rounded-lg bg-white/10 p-4 transition-all hover:bg-white/20">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
        <Image
          src={shop.imageUrl}
          alt={`${street}, ${city}`}
          fill
          sizes="80px"
          className="object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold tracking-wide">{city}</h3>
          <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-medium tracking-wider text-gray-300">
            {shop.type}
          </span>
        </div>
        <p className="text-sm tracking-wider text-gray-400">{street}</p>
      </div>
    </li>
  );
};

const ShopListSkeleton = () =>
  Array.from({ length: 3 }).map((_, i) => (
    <li
      key={i}
      className="flex items-center gap-4 rounded-lg bg-white/10 p-4"
      data-testid="shop-list-skeleton"
    >
      <div className="h-20 w-20 flex-shrink-0 animate-pulse rounded-lg bg-white/20" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-6">
          <div className="h-6 w-24 animate-pulse rounded bg-white/20 lg:w-32" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-white/20 lg:w-24" />
        </div>
        <div className="h-4 w-32 animate-pulse rounded bg-white/20 lg:w-48" />
      </div>
    </li>
  ));

const VirtualizedShopList = ({ shops }: { shops: Shop[] }) => {
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const observerTarget = useRef<HTMLLIElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleItems((prev) =>
              Math.min(prev + ITEMS_PER_PAGE, shops.length),
            );
            setIsLoadingMore(false);
          }, 500);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [shops.length, isLoadingMore]);

  return (
    <>
      {shops.slice(0, visibleItems).map((shop) => (
        <ShopItem key={shop.id} shop={shop} />
      ))}
      {visibleItems < shops.length && (
        <li
          ref={observerTarget}
          className="flex h-16 w-full items-center justify-center"
        >
          {isLoadingMore && (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          )}
        </li>
      )}
    </>
  );
};

export const ShopList = () => {
  const { data: shops, isLoading, error } = api.shops.getShops.useQuery();

  return (
    <ul className="flex w-full max-w-2xl flex-col gap-4">
      {error ? (
        <li className="flex w-full items-center justify-center">
          <p className="text-center text-red-400">
            Something went wrong. Please try again later.
          </p>
        </li>
      ) : isLoading ? (
        <ShopListSkeleton />
      ) : !shops?.length ? (
        <li className="flex w-full items-center justify-center">
          <p className="text-center text-gray-400">No shops found</p>
        </li>
      ) : (
        <VirtualizedShopList shops={shops} />
      )}
    </ul>
  );
};
