"use client";

import { favoriteApi } from "@/app/api/favorite.api";
import { useFavorites } from "@/app/hook/useFavorite";
import { Property } from "@/app/types/ApiResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MapPin, Bed, Square } from "lucide-react";
import Image from "next/image";

import { useState } from "react";

interface IpropertyDataProps {
  data: Property;
}

export default function PropertyCard({ data }: IpropertyDataProps) {
  const queryClient = useQueryClient();
  const { favoriteIds } = useFavorites();

  const isFavorite = favoriteIds.includes(data._id);

  const [animate, setAnimate] = useState(false);

  // ✅ MUTATION
  const mutation = useMutation({
    mutationFn: () =>
      isFavorite
        ? favoriteApi.remove(data._id)
        : favoriteApi.add(data._id),

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async () => {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);

      await queryClient.cancelQueries({ queryKey: ["favorites"] });

      const prev = queryClient.getQueryData<any>(["favorites"]);

      queryClient.setQueryData(["favorites"], (old: any) => {
        if (!old) return old;

        if (isFavorite) {
          return {
            ...old,
            data: old.data.filter(
              (fav: any) => fav.property._id !== data._id
            ),
          };
        } else {
          return {
            ...old,
            data: [
              ...old.data,
              {
                _id: Math.random(),
                property: data,
              },
            ],
          };
        }
      });

      return { prev };
    },

    // ❌ rollback if error
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["favorites"], context?.prev);
    },

    // ✅ sync with backend
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">

      {/* IMAGE */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={data.images[0]}
          alt={data.title}
          width={100}
          height={100}
          className="w-full h-full object-cover"
        />

        {/* ❤️ HEART */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className={`p-3 rounded-full bg-white/80 hover:bg-white transition-all
              ${animate ? "scale-125 -translate-y-1" : ""}
            `}
          >
            <Heart
              size={20}
              className={`transition-all duration-300 ${
                isFavorite
                  ? "text-red-500 fill-red-500"
                  : "text-gray-600"
              }`}
            />
          </button>
        </div>

        {/* PRICE */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-white/90 px-4 py-1 rounded-full text-indigo-600 font-bold shadow-sm">
            ${data.price.toLocaleString()}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        <h3 className="text-xl font-bold">{data.title}</h3>

        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin size={16} className="mr-1" />
          {data.location.address}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <div className="flex items-center gap-1">
            <Bed size={18} />
            {data.bedrooms}
          </div>

          <div className="flex items-center gap-1">
            <Square size={18} />
            {data.areaSqFt}
          </div>
        </div>
      </div>
    </div>
  );
}