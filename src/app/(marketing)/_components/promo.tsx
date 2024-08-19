"use client";
import Image from "next/image";
import React from "react";
import { WobbleCard } from "./ui/wobble-card";

export function Promo() {
  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 lg:grid-cols-3">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-teal-500 min-h-[500px] lg:min-h-[300px]"
        className=""
      >
        <div className="max-w-xs">
          <h2 className="text-balance text-left text-base font-semibold tracking-[-0.015em] text-white md:text-xl lg:text-3xl">
            Un large choix de films
          </h2>
          <p className="mt-4 text-left text-base/6 text-neutral-200">
            Nous répertorions plus de 10 000 films tous genres confondus, votre
            film favori doit sans doute y être. Plus un film obtient de bonnes
            notes, plus il sera visible sur l&apos;application.
          </p>
        </div>
        <Image
          src="/img/accueil_preview.png"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -bottom-10 -right-4 rounded-2xl object-contain grayscale filter lg:-right-[40%]"
        />
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-blue-500">
        <h2 className="max-w-80 text-balance text-left text-base font-semibold tracking-[-0.015em] text-white md:text-xl lg:text-3xl">
          Faites votre liste
        </h2>
        <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
          Ajoutez des films à vos favoris pour les retrouver plus facilement.
        </p>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-primary min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="max-w-sm text-balance text-left text-base font-semibold tracking-[-0.015em] text-primary-foreground md:max-w-lg md:text-xl lg:text-3xl">
            Retrouvez-vous
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-primary-foreground">
            Chaque film possède son propre salon textuel, c&apos;est un excellent
            moyen de vous retrouver entre cinéphiles passionnés.
          </p>
        </div>
        <Image
          src="/img/space_preview.png"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -bottom-10 -right-10 rounded-2xl object-contain md:-right-[40%] lg:-right-[20%]"
        />
      </WobbleCard>
    </div>
  );
}
