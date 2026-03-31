"use client";

import { useAuth } from "../components/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { favoriteApi} from "../api/favorite.api";
import PropertyCard from "../components/UI/PropertyCard";




const Userprofile = () => {
    const { user, isLoading } = useAuth();

    const {
        data: favoriteData,
        isLoading: favLoading,
        isError,
    } = useQuery({
  queryKey: ["favorites"],
  queryFn: favoriteApi.getMine,
});

    // 🔄 Loading state
    if (isLoading) {
        return (
            <div className="p-6 text-center text-gray-500">
                Loading profile...
            </div>
        );
    }

    // ❌ Not logged in
    if (!user) {
        return (
            <div className="p-6 text-center text-red-500">
                Please login to view your profile
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 md:px-10 py-10 mt-10">

            {/* 👤 USER INFO */}
            <div className="bg-white rounded-2xl shadow-xs border border-gray-50 p-6 mb-10 flex flex-col md:flex-row items-center gap-6">

                <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold">
                    {user.name[0]}
                </div>

                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {user.name}
                    </h2>
                    <p className="text-gray-500">{user.email}</p>

                    <div className="mt-2 flex gap-3 justify-center md:justify-start">
                        <span className="px-3 py-1 text-sm bg-indigo-100 text-indigo-600 rounded-full">
                            {user.role}
                        </span>

                        <span
                            className={`px-3 py-1 text-sm rounded-full ${user.isVerified
                                ? "bg-green-100 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                                }`}
                        >
                            {user.isVerified ? "Verified" : "Not Verified"}
                        </span>
                    </div>
                </div>
            </div>

            {/* ❤️ FAVORITES */}
            <div>
                <h3 className="text-xl font-bold mb-6 text-gray-800">
                    Your Favorite Properties ({favoriteData?.count || 0})
                </h3>

                {favLoading && (
                    <p className="text-gray-500">Loading favorites...</p>
                )}

                {isError && (
                    <p className="text-red-500">Failed to load favorites</p>
                )}

                {!favLoading && favoriteData?.data?.length === 0 && (
                    <p className="text-gray-500">No favorite properties yet</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {favoriteData?.data?.map((fav) => (
                        <PropertyCard key={fav._id} data={fav.property} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Userprofile;