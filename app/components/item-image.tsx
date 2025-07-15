import { CS2EconomyItem, CS2InventoryItem } from "@ianlucas/cs2-lib";
import clsx from "clsx";
import { ComponentProps, useEffect, useState } from "react";
import { isServerContext } from "~/globals";
import { getCDNUrl } from "~/utils/economy";
import { noop } from "~/utils/misc";
import { FillSpinner } from "./fill-spinner";
import { CUSTOM_OVERRIDES } from "~/utils/custom-overrides";
import Lottie from "lottie-react";
import { isContainerItem } from "~/utils/inventory-filters";


let cached: string[] = [];

export function ItemImage({
  className,
  item,
  lazy,
  onLoad,
  type,
  wear,
  disableAnimation = false,
  ...props
}: Omit<ComponentProps<"img">, "onLoad"> & {
  item: CS2EconomyItem | CS2InventoryItem;
  lazy?: boolean;
  onLoad?: () => void;
  type?: "default" | "collection" | "specials";
  wear?: number;
  disableAnimation?: boolean;
}) {
  type ??= "default";

  const override = CUSTOM_OVERRIDES[item.id];
  const animationPath = !disableAnimation ? override?.animation : undefined;
  const shouldAutoplay = !isContainerItem(item);

  const url =
    override?.image ??
    getCDNUrl(
      type === "default"
        ? item.getImage(wear)
        : type === "collection"
        ? item.getCollectionImage()
        : item.getSpecialsImage()
    );

  const [animationData, setAnimationData] = useState<any>(null);
  const [loaded, setLoaded] = useState(
    animationPath ? false : cached.includes(url) || url.includes("steamcommunity")
  );

  // Lottie animation loader
  useEffect(() => {
    if (animationPath) {
      fetch(animationPath)
        .then((res) => res.json())
        .then((json) => {
          setAnimationData(json);
          setLoaded(true);
        })
        .catch(noop);
    }
  }, [animationPath]);

  // Image loader
  useEffect(() => {
    if (!animationPath && !loaded) {
      let controller: AbortController | undefined;
      function fetchImage() {
        controller = new AbortController();
        fetch(url, { signal: controller?.signal })
          .then(() => {
            setLoaded(true);
            if (!isServerContext) {
              cached.push(url);
            }
          })
          .catch(noop);
      }
      const idx = setTimeout(fetchImage, lazy ? 500 : 1);
      return () => {
        clearTimeout(idx);
        controller?.abort();
      };
    }
  }, [lazy, loaded, animationPath, url]);

  useEffect(() => {
    if (loaded) {
      onLoad?.();
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <div
        {...props}
        className={clsx(
          "relative flex aspect-256/192 items-center justify-center",
          className
        )}
      >
        <FillSpinner className="opacity-50" />
      </div>
    );
  }

  if (animationData) {
    return (
      <Lottie
        animationData={animationData}
        loop={false}
        autoplay={shouldAutoplay}
        className={clsx("aspect-256/192", className)}
        {...props}
      />
    );
  }

  return (
    <img
      alt={item.name}
      draggable={false}
      src={url}
      {...props}
      className={clsx("aspect-256/192", className)}
    />
  );
}
